import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { createCar } from "../../api/createCar";
import type { Car } from "../../api/getCustomers";
import {
  getCarModels,
  getCityPlateLetters,
  getMetaData,
  getPlateTypesForCity,
  type CarModel,
  type MetaDataResponse,
  type PlateTypeForCity,
} from "../../api/getMetaData";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface AddVehicleDialogProps {
  customerId: number;
  onVehicleAdded: (vehicle: Car) => void;
  disabled?: boolean;
}

export const AddVehicleDialog = ({
  customerId,
  onVehicleAdded,
  disabled,
}: AddVehicleDialogProps) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMeta, setIsLoadingMeta] = useState(false);
  const [isLoadingPlateTypes, setIsLoadingPlateTypes] = useState(false);
  const [isLoadingCarModels, setIsLoadingCarModels] = useState(false);
  const [error, setError] = useState("");
  const [metaData, setMetaData] = useState<MetaDataResponse | null>(null);
  const [carModels, setCarModels] = useState<CarModel[]>([]);
  const [plateTypesForCity, setPlateTypesForCity] = useState<
    PlateTypeForCity[]
  >([]);
  const [plateLetters, setPlateLetters] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    city_id: "",
    car_brand_id: "",
    car_model_id: "",
    plate_type_id: "",
    car_type_id: "",
    car_group_id: "",
    color: "",
    year: "",
    code: "",
    numbers: "",
  }); // Load metadata when dialog opens
  useEffect(() => {
    if (open && !metaData) {
      const loadMetaData = async () => {
        setIsLoadingMeta(true);
        try {
          const data = await getMetaData();
          console.log("Meta data received:", data);
          setMetaData(data);
        } catch (err) {
          setError("Failed to load form data. Please try again.");
          console.error("Error loading meta data:", err);
        } finally {
          setIsLoadingMeta(false);
        }
      };
      loadMetaData();
    }
  }, [open, metaData]);

  // Load car models when brand changes
  useEffect(() => {
    if (formData.car_brand_id) {
      const loadCarModels = async () => {
        setIsLoadingCarModels(true);
        try {
          const models = await getCarModels(formData.car_brand_id);
          setCarModels(models);
        } catch (err) {
          console.error("Error loading car models:", err);
          setCarModels([]);
        } finally {
          setIsLoadingCarModels(false);
        }
      };
      loadCarModels();
    } else {
      setCarModels([]);
    }
  }, [formData.car_brand_id]);

  // Load plate types when city changes
  useEffect(() => {
    if (formData.city_id) {
      const loadPlateTypes = async () => {
        setIsLoadingPlateTypes(true);
        try {
          const plateTypes = await getPlateTypesForCity(formData.city_id);
          setPlateTypesForCity(plateTypes);
          // Clear plate type selection when city changes
          setFormData((prev) => ({ ...prev, plate_type_id: "" }));
        } catch (err) {
          console.error("Error loading plate types:", err);
          setPlateTypesForCity([]);
        } finally {
          setIsLoadingPlateTypes(false);
        }
      };
      loadPlateTypes();
    } else {
      setPlateTypesForCity([]);
    }
  }, [formData.city_id]);
  // Load plate letters when city and plate type change
  useEffect(() => {
    if (formData.city_id && formData.plate_type_id) {
      const loadPlateLetters = async () => {
        try {
          const letters = await getCityPlateLetters(
            formData.city_id,
            formData.plate_type_id
          );
          setPlateLetters(letters);
          console.log("Plate letters received:", letters);
          // Clear code if current code is not in the new letters list
          setFormData((prev) => ({
            ...prev,
            code: letters.includes(prev.code) ? prev.code : "",
          }));
        } catch (err) {
          console.error("Error loading plate letters:", err);
          setPlateLetters([]);
          // Clear code when letters fail to load
          setFormData((prev) => ({ ...prev, code: "" }));
        }
      };
      loadPlateLetters();
    } else {
      setPlateLetters([]);
      // Clear code when no city or plate type selected
      setFormData((prev) => ({ ...prev, code: "" }));
    }
  }, [formData.city_id, formData.plate_type_id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const carData = {
        city_id: parseInt(formData.city_id),
        car_brand_id: parseInt(formData.car_brand_id),
        car_model_id: formData.car_model_id
          ? parseInt(formData.car_model_id)
          : undefined,
        plate_type_id: formData.plate_type_id,
        car_type_id: formData.car_type_id,
        car_group_id: parseInt(formData.car_group_id),
        color: formData.color,
        year: formData.year,
        code: formData.code,
        numbers: formData.numbers,
        user_id: customerId,
      };

      const response = await createCar(carData);
      // Handle different response structures
      const newCar =
        response.data ??
        ({
          id: response.id ?? Date.now(),
          business_id: response.business_id ?? 1,
          user_id: response.user_id ?? customerId,
          city_id: response.city_id ?? carData.city_id,
          car_brand_id: response.car_brand_id ?? carData.car_brand_id,
          car_model_id: response.car_model_id ?? carData.car_model_id,
          car_type_id: response.car_type_id ?? null,
          plate_type_id: response.plate_type_id ?? carData.plate_type_id,
          color: response.color ?? carData.color,
          year: response.year ?? carData.year,
          code: response.code ?? carData.code,
          numbers: response.numbers ?? carData.numbers,
          created_at: response.created_at ?? new Date().toISOString(),
          updated_at: response.updated_at ?? new Date().toISOString(),
          car_group_id: response.car_group_id ?? carData.car_group_id,
          plate_img: response.plate_img ?? "",
          image: response.image ?? null,
          car_type: null,
          plate_type: {
            id: carData.plate_type_id,
            name: metaData?.car_types?.find((t) => t.id === carData.car_type_id)
              ?.name ?? { ar: "", en: "" },
          },
          city: metaData?.cities?.find((c) => c.id === carData.city_id) ?? {
            id: carData.city_id,
            business_id: 1,
            name: { en: "", ar: "", code: "" },
            code: "",
            is_active: 1,
            order_column: 1,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        } as Car);
      onVehicleAdded(newCar);
      setOpen(false);
      resetForm();
    } catch (err: unknown) {
      console.error("Error creating vehicle:", err);

      // Handle specific API validation errors
      if (err && typeof err === "object" && "response" in err) {
        const error = err as {
          response?: {
            data?: { message?: string; errors?: Record<string, string[]> };
          };
        };
        if (error.response?.data?.message) {
          setError(error.response.data.message);
        } else if (error.response?.data?.errors) {
          const errorMessages = Object.values(error.response.data.errors)
            .flat()
            .join(", ");
          setError(`Validation errors: ${errorMessages}`);
        } else {
          setError("Failed to create vehicle. Please try again.");
        }
      } else {
        setError("Failed to create vehicle. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };
  const handleInputChange =
    (field: keyof typeof formData) => (value: string) => {
      setFormData((prev) => {
        const newData = { ...prev, [field]: value };
        // Clear car model when brand changes
        if (field === "car_brand_id") {
          newData.car_model_id = "";
        }
        // Clear plate type when city changes (handled in useEffect)
        // Clear plate code when plate type changes
        if (field === "plate_type_id") {
          newData.code = "";
        }
        return newData;
      });
    };
  const resetForm = () => {
    setFormData({
      city_id: "",
      car_brand_id: "",
      car_model_id: "",
      plate_type_id: "",
      car_type_id: "",
      car_group_id: "",
      color: "",
      year: "",
      code: "",
      numbers: "",
    });
    setError("");
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        setOpen(newOpen);
        if (!newOpen) {
          resetForm();
        }
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="ml-2 h-10 w-10 border-green-500/40 hover:border-green-500/60"
          disabled={disabled}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Vehicle</DialogTitle>
          <DialogDescription>
            Add a new vehicle for the selected customer. All required fields
            must be filled.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 text-sm">
            {error}
          </div>
        )}

        {isLoadingMeta ? (
          <div className="text-center py-8 text-green-300">
            Loading form data...
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* City */}
              <div className="space-y-2">
                <label
                  htmlFor="city"
                  className="text-sm font-medium text-green-300"
                >
                  City *
                </label>
                <Select
                  value={formData.city_id}
                  onValueChange={handleInputChange("city_id")}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a city" />
                  </SelectTrigger>
                  <SelectContent>
                    {metaData?.cities?.map((city) => (
                      <SelectItem key={city.id} value={city.id.toString()}>
                        {city.name.en} ({city.name.ar})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {/* Car Brand */}
              <div className="space-y-2">
                <label
                  htmlFor="car-brand"
                  className="text-sm font-medium text-green-300"
                >
                  Car Brand *
                </label>
                <Select
                  value={formData.car_brand_id}
                  onValueChange={handleInputChange("car_brand_id")}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a brand" />
                  </SelectTrigger>
                  <SelectContent>
                    {metaData?.car_brands?.map((brand) => (
                      <SelectItem key={brand.id} value={brand.id.toString()}>
                        {brand.name.en} ({brand.name.ar})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>{" "}
              </div>{" "}
              {/* Car Model */}
              <div className="space-y-2">
                <label
                  htmlFor="car-model"
                  className="text-sm font-medium text-green-300"
                >
                  Car Model
                </label>{" "}
                <Select
                  value={formData.car_model_id}
                  onValueChange={handleInputChange("car_model_id")}
                  disabled={
                    !formData.car_brand_id || isLoadingCarModels || isLoading
                  }
                >
                  <SelectTrigger>
                    {" "}
                    <SelectValue
                      placeholder={(() => {
                        if (!formData.car_brand_id)
                          return "Select a brand first";
                        if (isLoadingCarModels) return "Loading models...";
                        return "Select a model";
                      })()}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {carModels?.map((model) => (
                      <SelectItem key={model.id} value={model.id.toString()}>
                        {model.name.en} ({model.name.ar})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {/* Car Group */}
              <div className="space-y-2">
                <label
                  htmlFor="car-group"
                  className="text-sm font-medium text-green-300"
                >
                  Car Group *
                </label>
                <Select
                  value={formData.car_group_id}
                  onValueChange={handleInputChange("car_group_id")}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a group" />
                  </SelectTrigger>
                  <SelectContent>
                    {metaData?.car_groups?.map((group) => (
                      <SelectItem key={group.id} value={group.id.toString()}>
                        {group.name.en} ({group.name.ar})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {/* Car Type */}
              <div className="space-y-2">
                <label
                  htmlFor="car-type"
                  className="text-sm font-medium text-green-300"
                >
                  Car Type *
                </label>
                <Select
                  value={formData.car_type_id}
                  onValueChange={handleInputChange("car_type_id")}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a type" />
                  </SelectTrigger>
                  <SelectContent>
                    {metaData?.car_types?.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.name.en} ({type.name.ar})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>{" "}
              {/* Plate Type */}
              <div className="space-y-2">
                <label
                  htmlFor="plate-type"
                  className="text-sm font-medium text-green-300"
                >
                  Plate Type *
                </label>
                <Select
                  value={formData.plate_type_id}
                  onValueChange={handleInputChange("plate_type_id")}
                  required
                  disabled={
                    !formData.city_id || isLoadingPlateTypes || isLoading
                  }
                >
                  {" "}
                  <SelectTrigger>
                    <SelectValue
                      placeholder={(() => {
                        if (!formData.city_id) return "Select a city first";
                        if (isLoadingPlateTypes)
                          return "Loading plate types...";
                        return "Select plate type";
                      })()}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {plateTypesForCity?.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.name.en} ({type.name.ar})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {/* Year */}
              <div className="space-y-2">
                <label
                  htmlFor="year"
                  className="text-sm font-medium text-green-300"
                >
                  Year *
                </label>
                <Input
                  id="year"
                  type="number"
                  placeholder="2024"
                  value={formData.year}
                  onChange={(e) => handleInputChange("year")(e.target.value)}
                  required
                  disabled={isLoading}
                  min="1900"
                  max="2030"
                />
              </div>
              {/* Color */}
              <div className="space-y-2">
                <label
                  htmlFor="color"
                  className="text-sm font-medium text-green-300"
                >
                  Color *
                </label>
                <Input
                  id="color"
                  type="text"
                  placeholder="#FFFFFF"
                  value={formData.color}
                  onChange={(e) => handleInputChange("color")(e.target.value)}
                  required
                  disabled={isLoading}
                />{" "}
              </div>
              {/* Plate Code */}
              <div className="space-y-2">
                <label
                  htmlFor="code"
                  className="text-sm font-medium text-green-300"
                >
                  Plate Code *
                </label>
                {plateLetters.length > 0 ? (
                  <Select
                    value={formData.code}
                    onValueChange={handleInputChange("code")}
                    required
                    disabled={!formData.plate_type_id || isLoading}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          !formData.plate_type_id
                            ? "Select plate type first"
                            : "Select plate code"
                        }
                      />
                    </SelectTrigger>{" "}
                    <SelectContent>
                      {plateLetters.map((letter) => (
                        <SelectItem key={letter} value={letter}>
                          {letter}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    id="code"
                    type="text"
                    placeholder="A"
                    value={formData.code}
                    onChange={(e) => handleInputChange("code")(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                )}
              </div>
              {/* Plate Numbers */}
              <div className="space-y-2">
                <label
                  htmlFor="numbers"
                  className="text-sm font-medium text-green-300"
                >
                  Plate Numbers *
                </label>
                <Input
                  id="numbers"
                  type="text"
                  placeholder="12345"
                  value={formData.numbers}
                  onChange={(e) => handleInputChange("numbers")(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading || isLoadingMeta}>
                {isLoading ? "Creating..." : "Create Vehicle"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};
