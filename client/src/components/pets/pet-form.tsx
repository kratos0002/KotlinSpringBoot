import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Pet, insertPetSchema } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Camera, Loader2 } from "lucide-react";

const petFormSchema = insertPetSchema
  .omit({ userId: true })
  .extend({
    healthInfo: z.object({
      vaccinated: z.boolean().optional(),
      neutered: z.boolean().optional(),
      microchipped: z.boolean().optional(),
    }).optional(),
  });

type PetFormData = z.infer<typeof petFormSchema>;

interface PetFormProps {
  pet?: Pet;
  onSuccess: () => void;
}

export default function PetForm({ pet, onSuccess }: PetFormProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [petPhoto, setPetPhoto] = useState<string | undefined>(pet?.profilePicture || undefined);
  
  const form = useForm<PetFormData>({
    resolver: zodResolver(petFormSchema),
    defaultValues: pet ? {
      name: pet.name,
      type: pet.type,
      breed: pet.breed || "",
      age: pet.age || undefined,
      ageUnit: pet.ageUnit || "years",
      gender: pet.gender || "",
      weight: pet.weight || undefined,
      description: pet.description || "",
      healthInfo: pet.healthInfo ? (typeof pet.healthInfo === 'string' ? JSON.parse(pet.healthInfo) : pet.healthInfo) : {
        vaccinated: false,
        neutered: false,
        microchipped: false,
      },
    } : {
      name: "",
      type: "",
      breed: "",
      age: undefined,
      ageUnit: "years",
      gender: "",
      weight: undefined,
      description: "",
      healthInfo: {
        vaccinated: false,
        neutered: false,
        microchipped: false,
      },
    },
  });

  const onSubmit = async (data: PetFormData) => {
    setIsLoading(true);
    try {
      // Include the pet photo
      const petData = {
        ...data,
        profilePicture: petPhoto,
      };

      if (pet) {
        // Update existing pet
        await apiRequest("PUT", `/api/pets/${pet.id}`, petData);
        toast({
          title: "Pet updated",
          description: `${data.name}'s profile has been updated.`,
        });
      } else {
        // Create new pet
        await apiRequest("POST", "/api/pets", petData);
        toast({
          title: "Pet added",
          description: `${data.name} has been added to your pets.`,
        });
      }
      
      // Refresh pets data
      queryClient.invalidateQueries({ queryKey: ["/api/pets"] });
      onSuccess();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save pet",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPetPhoto(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex flex-col items-center mb-6">
        <div className="w-32 h-32 rounded-full bg-gray-200 mb-4 overflow-hidden relative flex items-center justify-center">
          {petPhoto ? (
            <img src={petPhoto} alt="Pet" className="w-full h-full object-cover" />
          ) : (
            <span className="material-icons text-gray-400 text-5xl">pets</span>
          )}
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
            <Camera size={24} className="text-white" />
          </div>
          <input 
            type="file" 
            className="absolute inset-0 opacity-0 cursor-pointer" 
            id="petPhotoUpload"
            accept="image/*"
            onChange={handlePhotoChange}
          />
        </div>
        <Label htmlFor="petPhotoUpload" className="text-primary font-medium cursor-pointer">
          Upload Photo
        </Label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <Label htmlFor="name">Pet Name</Label>
          <Input
            id="name"
            placeholder="e.g. Max"
            {...form.register("name")}
          />
          {form.formState.errors.name && (
            <p className="text-red-500 text-xs mt-1">{form.formState.errors.name.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="type">Pet Type</Label>
          <Select
            onValueChange={(value) => form.setValue("type", value)}
            defaultValue={form.getValues("type")}
          >
            <SelectTrigger id="type">
              <SelectValue placeholder="Select Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Dog">Dog</SelectItem>
              <SelectItem value="Cat">Cat</SelectItem>
              <SelectItem value="Bird">Bird</SelectItem>
              <SelectItem value="Rabbit">Rabbit</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
          {form.formState.errors.type && (
            <p className="text-red-500 text-xs mt-1">{form.formState.errors.type.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="breed">Breed</Label>
          <Input
            id="breed"
            placeholder="e.g. Golden Retriever"
            {...form.register("breed")}
          />
        </div>

        <div>
          <Label htmlFor="age">Age</Label>
          <div className="flex">
            <Input
              id="age"
              type="number"
              placeholder="Age"
              min="0"
              max="30"
              className="w-1/2 rounded-r-none"
              {...form.register("age", { valueAsNumber: true })}
            />
            <Select
              defaultValue={form.getValues("ageUnit") || undefined}
              onValueChange={(value) => form.setValue("ageUnit", value)}
            >
              <SelectTrigger className="w-1/2 rounded-l-none">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="years">Years</SelectItem>
                <SelectItem value="months">Months</SelectItem>
                <SelectItem value="weeks">Weeks</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="gender">Gender</Label>
          <Select
            defaultValue={form.getValues("gender") || undefined}
            onValueChange={(value) => form.setValue("gender", value)}
          >
            <SelectTrigger id="gender">
              <SelectValue placeholder="Select Gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Male">Male</SelectItem>
              <SelectItem value="Female">Female</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="weight">Weight (kg)</Label>
          <Input
            id="weight"
            type="number"
            placeholder="e.g. 15"
            min="0"
            {...form.register("weight", { valueAsNumber: true })}
          />
        </div>
      </div>

      <div className="mb-6">
        <Label htmlFor="description">About your pet</Label>
        <Textarea
          id="description"
          placeholder="Tell us about your pet's personality, likes, and dislikes..."
          rows={3}
          {...form.register("description")}
        />
      </div>

      <h4 className="font-poppins text-lg font-semibold mb-3">Health Information</h4>
      <div className="space-y-3 mb-6">
        <div className="flex items-center">
          <Checkbox
            id="vaccinated"
            checked={form.watch("healthInfo.vaccinated")}
            onCheckedChange={(checked) => {
              form.setValue("healthInfo.vaccinated", checked === true);
            }}
          />
          <Label htmlFor="vaccinated" className="ml-2">
            Vaccinated
          </Label>
        </div>
        <div className="flex items-center">
          <Checkbox
            id="neutered"
            checked={form.watch("healthInfo.neutered")}
            onCheckedChange={(checked) => {
              form.setValue("healthInfo.neutered", checked === true);
            }}
          />
          <Label htmlFor="neutered" className="ml-2">
            Spayed/Neutered
          </Label>
        </div>
        <div className="flex items-center">
          <Checkbox
            id="microchipped"
            checked={form.watch("healthInfo.microchipped")}
            onCheckedChange={(checked) => {
              form.setValue("healthInfo.microchipped", checked === true);
            }}
          />
          <Label htmlFor="microchipped" className="ml-2">
            Microchipped
          </Label>
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4 border-t">
        <Button 
          type="button" 
          variant="outline"
          onClick={onSuccess}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button 
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {pet ? "Updating..." : "Saving..."}
            </>
          ) : (
            pet ? "Update Pet" : "Save Pet"
          )}
        </Button>
      </div>
    </form>
  );
}
