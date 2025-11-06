
'use client';
import { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { API_BASE_URL } from '@/lib/config';
import { Theme } from '@/lib/types';

const themeSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  duration_minutes: z.coerce.number().int().min(1, 'Duration must be at least 1 minute'),
  booking_limit_min: z.coerce.number().int().min(1, 'Min players must be at least 1'),
  booking_limit_max: z.coerce.number().int().min(1, 'Max players must be at least 1'),
}).refine(data => data.booking_limit_max >= data.booking_limit_min, {
    message: "Max players cannot be less than min players",
    path: ["booking_limit_max"],
});

type ThemeFormValues = z.infer<typeof themeSchema>;

interface CreateThemeDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
    theme?: Theme | null;
}

export function CreateThemeDialog({ open, onOpenChange, onSuccess, theme }: CreateThemeDialogProps) {
    const { register, handleSubmit, formState: { errors, isSubmitting }, reset, setValue } = useForm<ThemeFormValues>({
        resolver: zodResolver(themeSchema),
    });
    const { toast } = useToast();

    const isEditMode = !!theme;

    useEffect(() => {
        if (open) {
            if (isEditMode && theme) {
                setValue('name', theme.name);
                setValue('description', theme.description);
                setValue('duration_minutes', theme.duration_minutes);
                setValue('booking_limit_min', theme.booking_limit_min);
                setValue('booking_limit_max', theme.booking_limit_max);
            } else {
                reset();
            }
        }
    }, [open, theme, isEditMode, setValue, reset]);


    const onSubmit: SubmitHandler<ThemeFormValues> = async (data) => {
        try {
            const url = isEditMode 
                ? `${API_BASE_URL}/themes/${theme.theme_id}`
                : `${API_BASE_URL}/themes/`;

            const method = isEditMode ? 'PUT' : 'POST';
            
            const payload = isEditMode 
                ? data 
                : { ...data, theme_id: Math.random().toString(36).substring(2, 15).toUpperCase() };


            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ detail: `HTTP Error: ${response.status}` }));
                throw new Error(errorData.detail || `Failed to ${isEditMode ? 'update' : 'create'} theme.`);
            }

            toast({
                title: 'Success!',
                description: `Theme "${data.name}" has been ${isEditMode ? 'updated' : 'created'}.`,
            });

            onSuccess();
            onOpenChange(false);
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Uh oh! Something went wrong.',
                description: (error as Error).message,
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <DialogHeader>
                        <DialogTitle>{isEditMode ? 'Edit Theme' : 'Create New Theme'}</DialogTitle>
                        <DialogDescription>
                           {isEditMode ? 'Update the details of your event theme.' : 'Configure the details for a new event theme.'}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-6">
                        <div className="space-y-2">
                            <Label htmlFor="name">Theme Name</Label>
                            <Input id="name" {...register('name')} />
                            {errors.name && <p className="text-xs text-red-600">{errors.name.message}</p>}
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea id="description" {...register('description')} />
                            {errors.description && <p className="text-xs text-red-600">{errors.description.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="duration_minutes">Duration (minutes)</Label>
                            <Input id="duration_minutes" type="number" {...register('duration_minutes')} />
                            {errors.duration_minutes && <p className="text-xs text-red-600">{errors.duration_minutes.message}</p>}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                             <div className="space-y-2">
                                <Label htmlFor="booking_limit_min">Min Players</Label>
                                <Input id="booking_limit_min" type="number" {...register('booking_limit_min')} />
                                {errors.booking_limit_min && <p className="text-xs text-red-600">{errors.booking_limit_min.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="booking_limit_max">Max Players</Label>
                                <Input id="booking_limit_max" type="number" {...register('booking_limit_max')} />
                                {errors.booking_limit_max && <p className="text-xs text-red-600">{errors.booking_limit_max.message}</p>}
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? (isEditMode ? 'Saving...' : 'Creating...') : (isEditMode ? 'Save Changes' : 'Create Theme')}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
