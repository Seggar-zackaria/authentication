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
import { ChangeEvent, useCallback } from "react"
import { useState } from "react"

export const ImageInput = ({form}: HotelFormProps ) => {
    const [images, setImages] = useState<string[]>([])
    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        if(e?.target?.files?.[0]){
            const file = Array.from(e.target.files)
            const reader = new FileReader()
            reader.onload = () => {
                setImages((prev)=> [...prev, reader.result as string])
            }
            reader.readAsDataURL(file[0])
        }
    }

    const image = form.watch("images") as string[];

    const handleRemoveImage = (imageToRemove: string) => {
        setImages((prev) => prev.filter((img) => img !== imageToRemove));
        form.setValue("images", images.filter((img) => img !== imageToRemove));
    };


    console.log(images)
    return (
        <div>
            <Form {...form}>
                <FormField 
                    control= {form.control}
                    name="images"
                    render= {({ field })=> (

                        <FormItem>
                            <FormLabel className="border-2 border-dashed border-gray-300 rounded-md p-3 cursor-pointer size-full flex items-center justify-center">upload an image</FormLabel>
                            <FormControl>
                                <Input  
                                className="hidden" 
                                {...field} 
                                type="file" 
                                multiple={true} 
                                accept="image/*" 
                                onChange={handleImageChange}
                                />
                            </FormControl>
                            <FormMessage />
                            <FormDescription>upload the hotel images</FormDescription>

                            <div className="flex flex-wrap gap-2 ">
                                {images && images.map((image, index)=>(
                                    <div className="group relative" key={index}>
                                        <Image className="rounded-md object-cover relative"  src={image} alt={'hotel image'} width={150} height={(9/16) * 150} />
                                        <Button className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => handleRemoveImage(image)} variant={"destructive"} size={'icon'}>
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