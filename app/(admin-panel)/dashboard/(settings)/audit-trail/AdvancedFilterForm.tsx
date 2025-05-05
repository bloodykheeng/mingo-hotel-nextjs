import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import moment from 'moment';

// PrimeReact Components
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Calendar } from 'primereact/calendar';
import { MultiSelect } from 'primereact/multiselect';
import { Button } from 'primereact/button';
import { Familjen_Grotesk } from 'next/font/google';


// Zod Schema for Validation
const AdvancedFilterSchema = z.object({
    startDate: z.date().optional(),
    endDate: z.date().optional(),
    selectedTargetAudience: z.array(z.object({
        id: z.number(),
        name: z.string(),
        code: z.string()
    })).optional()
}).refine(
    (data) => {
        if (data.startDate && data.endDate) {
            return data.startDate <= data.endDate;
        }
        return true;
    },
    { message: 'Start date cannot be after end date', path: ['startDate'] }
);


// TypeScript Interface
interface AdvancedFilterFormProps {
    onSubmit: (data: z.infer<typeof AdvancedFilterSchema>) => void;
    initialData?: Partial<z.infer<typeof AdvancedFilterSchema>>;
    selectedTargetAudience?: any[];
}

// Target Audience Options
const TargetAudienceOptions = [
    { id: 1, name: 'All', code: 'all' },
    { id: 2, name: 'Groups', code: 'groups' },
    { id: 3, name: 'Users', code: 'users' },
];


const AdvancedFilterForm: React.FC<AdvancedFilterFormProps> = ({
    onSubmit,
    initialData = {},
    selectedTargetAudience = []
}) => {
    const [accordionActiveIndex, setAccordionActiveIndex] = useState<number | number[]>();

    const {
        control,
        handleSubmit,
        reset,
        getValues,
        setValue,
        formState: { errors }
    } = useForm<z.infer<typeof AdvancedFilterSchema>>({
        resolver: zodResolver(AdvancedFilterSchema),
        defaultValues: initialData
    });

    const handleFormSubmit = (data: z.infer<typeof AdvancedFilterSchema>) => {
        onSubmit(data);
        setAccordionActiveIndex(undefined);
    };

    const handleClearFilters = () => {
        reset(initialData);

        // setValue("startDate", undefined);
        // setValue("endDate", undefined);
        // setValue("selectedTargetAudience", []);

        console.log('After Reset:', getValues());
        onSubmit({});
    };

    return (
        <div >
            <Accordion
                activeIndex={accordionActiveIndex}
                onTabChange={(e) => {
                    e.originalEvent.preventDefault()
                    setAccordionActiveIndex(e.index)
                }}
            >
                <AccordionTab header="Filters">
                    <form
                        onSubmit={handleSubmit(handleFormSubmit)}
                        className="grid gap-4"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {/* Start Date */}
                            <div className="flex flex-col">
                                <Controller
                                    name="startDate"
                                    control={control}
                                    render={({ field }) => (
                                        <div>
                                            <label
                                                htmlFor="startDate"
                                                className="block text-sm font-medium text-gray-700 mb-2"
                                            >
                                                Start Date
                                            </label>
                                            <Calendar
                                                id="startDate"
                                                value={field.value}
                                                onChange={(e) => field.onChange(e.value)}
                                                dateFormat="dd/mm/yy"
                                                showIcon
                                                showButtonBar
                                                className={errors.startDate ? 'p-invalid w-full' : 'w-full'}
                                            />
                                            {errors.startDate && (
                                                <small className="p-error">
                                                    {errors.startDate.message}
                                                </small>
                                            )}
                                        </div>
                                    )}
                                />
                            </div>

                            {/* End Date */}
                            <div className="flex flex-col">
                                <Controller
                                    name="endDate"
                                    control={control}
                                    render={({ field }) => (
                                        <div>
                                            <label
                                                htmlFor="endDate"
                                                className="block text-sm font-medium text-gray-700 mb-2"
                                            >
                                                End Date
                                            </label>
                                            <Calendar
                                                id="endDate"
                                                value={field.value}
                                                onChange={(e) => field.onChange(e.value)}
                                                dateFormat="dd/mm/yy"
                                                showIcon
                                                showButtonBar
                                                className={errors.endDate ? 'p-invalid w-full' : 'w-full'}
                                            />
                                            {errors.endDate && (
                                                <small className="p-error">
                                                    {errors.endDate.message}
                                                </small>
                                            )}
                                        </div>
                                    )}
                                />
                            </div>

                            {/* Target Audience (Optional) */}
                            {/* <div className="flex flex-col">
                                <Controller
                                    name="selectedTargetAudience"
                                    control={control}
                                    render={({ field }) => (
                                        <div>
                                            <label
                                                htmlFor="targetAudience"
                                                className="block text-sm font-medium text-gray-700 mb-2"
                                            >
                                                Filter by Target Audience
                                            </label>
                                            <MultiSelect
                                                id="targetAudience"
                                                value={field.value}
                                                options={TargetAudienceOptions}
                                                onChange={(e) => field.onChange(e.value)}
                                                optionLabel="name"
                                                placeholder="Select Target Audience"
                                                display="chip"
                                                className="w-full"
                                            />
                                        </div>
                                    )}
                                />
                            </div> */}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 space-x-4 mt-4">
                            <Button
                                type="submit"
                                label="Apply Filters"
                                className="p-button-primary"
                            />
                            <Button
                                type="button"
                                label="Clear Filters"
                                className="p-button-secondary"
                                onClick={handleClearFilters}
                            />
                        </div>
                    </form>
                </AccordionTab>
            </Accordion>
        </div>
    );
};

export default AdvancedFilterForm;