import {HotelFormProps} from "@/lib/types"
import {Input} from "@/components/ui/input"
import Image from "next/image"
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormControl,
    FormDescription
} from "@/components/ui/form"
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChangeEvent, useCallback, useEffect } from "react"
import { useState } from "react"

export const ImageInput = ({form}: HotelFormProps ) => {
    const [previewUrls, setPreviewUrls] = useState<string[]>([])
    
    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const files = Array.from(e.target.files);
            
            // Create temporary URLs for preview
            const urls = files.map(file => URL.createObjectURL(file));
            setPreviewUrls(prev => [...prev, ...urls]);
            
            // Store the actual files in the form
            form.setValue("images", files, {
                shouldValidate: true,
                shouldDirty: true,
                shouldTouch: true
            });
        }
    }

    // Add effect to clear preview URLs when form is reset
    useEffect(() => {
        const subscription = form.watch(() => {
            const images = form.getValues("images");
            if (!images || images.length === 0) {
                // Clear preview URLs and revoke object URLs
                previewUrls.forEach(url => URL.revokeObjectURL(url));
                setPreviewUrls([]);
            }
        });

        return () => subscription.unsubscribe();
    }, [form, previewUrls]);

    const handleRemoveImage = useCallback((indexToRemove: number) => {
        setPreviewUrls(prev => {
            const newUrls = prev.filter((_, index) => index !== indexToRemove);
            const currentFiles = form.getValues("images");
            const newFiles = Array.from(currentFiles).filter((_, index) => index !== indexToRemove);
            form.setValue("images", newFiles);
            return newUrls;
        });
    }, [form]);

    return (
        <div>
            <Form {...form}>
                <FormField 
                    control={form.control}
                    name="images"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="border-2 border-dashed border-gray-300 rounded-md p-6 cursor-pointer w-full flex flex-col items-center justify-center gap-2 hover:border-gray-400 transition-colors">
                                <span>Drop images here or click to upload</span>
                                <span className="text-sm text-gray-500">Supported formats: JPG, PNG, GIF (max 5MB)</span>
                            </FormLabel>
                            <FormControl>
                                <Input
                                    type="file"
                                    multiple={true}
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                            </FormControl>
                            <FormMessage />
                            <FormDescription>Upload the hotel images</FormDescription>

                            <div className="flex flex-wrap gap-2 mt-4">
                                {previewUrls.map((url, index) => (
                                    <div className="group relative" key={index}>
                                        <Image
                                            className="rounded-md object-cover"
                                            src={url}
                                            alt={`hotel image ${index + 1}`}
                                            width={150}
                                            height={(9/16) * 150}
                                        />
                                        <Button
                                            className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                            onClick={() => handleRemoveImage(index)}
                                            variant="destructive"
                                            size="icon"
                                        >
                                            <X />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </FormItem>
                    )}
                />
            </Form>
        </div>
    )
}