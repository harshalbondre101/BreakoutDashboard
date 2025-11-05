'use client';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { API_BASE_URL } from '@/lib/config';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, User, Users } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Employee {
  id: string;
  email: string;
  name: string;
  phone_number: string;
  branch_id: number;
  role: 'admin' | 'employee' | 'unassigned';
}

const employeeSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone_number: z.string().min(1, 'Phone number is required'),
  role: z.enum(['admin', 'employee', 'unassigned']),
  branch_id: z.coerce.number().int().min(0, 'Branch ID is required'),
});

type EmployeeFormValues = z.infer<typeof employeeSchema>;

export default function AccessControlTab() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateOpen, setCreateOpen] = useState(false);
  const { toast } = useToast();

  const fetchEmployees = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/employees`);
      if (!response.ok) {
        throw new Error(`Failed to fetch employees: ${response.statusText}`);
      }
      const data = await response.json();
      setEmployees(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      role: 'employee',
      branch_id: 1,
    }
  });

  const onSubmit = async (data: EmployeeFormValues) => {
    try {
      const response = await fetch(`${API_BASE_URL}/employees`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'An unknown error occurred.' }));
        throw new Error(errorData.detail || 'Failed to create employee.');
      }

      toast({
        title: 'Success!',
        description: `Employee "${data.name}" has been created.`,
      });
      fetchEmployees();
      setCreateOpen(false);
      reset();
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Error creating employee',
        description: err instanceof Error ? err.message : 'An unknown error occurred.',
      });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2"><Users className="w-6 h-6"/> Employee Management</h2>
        <Button onClick={() => setCreateOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Employee
        </Button>
      </div>

      {loading && <p>Loading employees...</p>}
      {error && <p className="text-red-500">{error}</p>}
      
      {!loading && !error && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone Number</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Branch ID</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employees.map((employee) => (
              <TableRow key={employee.id}>
                <TableCell className="font-medium">{employee.name}</TableCell>
                <TableCell>{employee.email}</TableCell>
                <TableCell>{employee.phone_number}</TableCell>
                <TableCell>
                  <Badge variant={employee.role === 'admin' ? 'default' : 'secondary'}>{employee.role}</Badge>
                </TableCell>
                <TableCell>{employee.branch_id}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Dialog open={isCreateOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-md">
          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Add New Employee</DialogTitle>
              <DialogDescription>Fill in the details to add a new employee to the system.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" {...register('name')} />
                {errors.name && <p className="text-xs text-red-600">{errors.name.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" {...register('email')} />
                {errors.email && <p className="text-xs text-red-600">{errors.email.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" {...register('password')} />
                {errors.password && <p className="text-xs text-red-600">{errors.password.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone_number">Phone Number</Label>
                <Input id="phone_number" {...register('phone_number')} />
                {errors.phone_number && <p className="text-xs text-red-600">{errors.phone_number.message}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Controller
                    control={control}
                    name="role"
                    render={({ field }) => (
                       <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="employee">Employee</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="unassigned">Unassigned</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.role && <p className="text-xs text-red-600">{errors.role.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="branch_id">Branch ID</Label>
                  <Input id="branch_id" type="number" {...register('branch_id')} />
                  {errors.branch_id && <p className="text-xs text-red-600">{errors.branch_id.message}</p>}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setCreateOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Creating...' : 'Create Employee'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
// Add react-hook-form and zod as dependencies if not already present
// This component assumes they are.
import { Controller, useForm, type UseFormReturn } from 'react-hook-form';
