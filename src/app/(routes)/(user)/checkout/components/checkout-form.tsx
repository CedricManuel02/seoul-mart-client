"use client";
import { createCheckoutServerAction } from "@/_action/(user)/checkout";
import { getShippingServerAction } from "@/_action/(user)/shipping";
import ButtonLoading from "@/_components/shared/button-loading/button-loading";
import { ICheckoutArray, ILocation } from "@/_interface/interface";
import { clearSelectedItems } from "@/_redux/features/cart-slice";
import {
  clearCheckoutTotal,
  resetShippingFee,
  setShippingFee,
  setShippingLoading,
} from "@/_redux/features/checkout-slice";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { z } from "zod";
import {
  getBarangaysServerAction,
  getCitiesServerAction,
  getProvincesServerAction,
} from "@/_action/(shared)/location";
import { clearLocation } from "@/_redux/features/location-slice";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import CheckoutPolicyModal from "./checkout-policy-modal";

const formsCheckoutSchema = z.object({
  firstname: z.string().min(1, { message: "First name is required" }),
  lastname: z.string().min(1, { message: "Last name is required" }),
  email: z.string().email().min(1, { message: "Email is required" }),
  phone: z.string().min(1, { message: "Phone is required" }),
  address: z.string().min(1, { message: "Address is required" }),
  province: z.string().min(1, { message: "Province is required" }),
  cities: z.string().min(1, { message: "City is required" }),
  barangay: z.string().min(1, { message: "barangay is required" }),
  order_policy_aggreement: z.boolean().refine((val) => val === true, {
    message: "You must agree to the order policy",
  }),
});

interface ILocations {
  provinces: string[];
  cities: string[];
  barangays: string[];
  provice_code: string;
  user_location: {
    latitude: number | null;
    longitude: number | null;
  };
}

export default function CheckoutForm() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState<boolean>(false);
  const [location, setLocation] = useState<ILocations>({
    provinces: [],
    cities: [],
    barangays: [],
    provice_code: "",
    user_location: {
      latitude: null,
      longitude: null,
    },
  });

  const checkout = useSelector(
    (state: { checkout: ICheckoutArray }) => state.checkout.item
  );
  const shipping_fee = useSelector(
    (state: { checkout: ICheckoutArray }) => state.checkout.shippingFee
  );
  const delivery_location = useSelector(
    (state: { location: ILocation }) => state.location
  );

  const form = useForm<z.infer<typeof formsCheckoutSchema>>({
    resolver: zodResolver(formsCheckoutSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
      email: "",
      phone: "",
      province: "",
      cities: "",
      address: "",
      barangay: "",
      order_policy_aggreement: false,
    },
  });

  async function onSubmit(values: z.infer<typeof formsCheckoutSchema>) {
    const { barangay, cities, province, latitude, longitude } =
      delivery_location;
    if (!barangay || !cities || !province || !latitude || !longitude) {
      return toast({
        title: "Pin your location",
        variant: "destructive",
        description: "You need to pin your location",
      });
    }

    // Format the city and remove the spaces
    const formattedCity = values.cities.replace("City of ", " ").trim();

    if (values.province !== province || formattedCity !== cities) {
      return toast({
        title: "Mismatch address",
        variant: "destructive",
        description:
          "This location is outside your choosen area, please go to the previous page to update your address",
      });
    }

    try {
      setLoading(true);

      if (
        shipping_fee === null &&
        Number.isNaN(shipping_fee) &&
        shipping_fee === 0
      ) {
        // Handle case where delivery is not available
        form.setError("province", {
          message: "Your location is not available for delivery",
        });
        return toast({
          variant: "destructive",
          title: "Oops!",
          description: "Your location is not available for delivery",
        });
      }
      const response = await createCheckoutServerAction({
        information: values,
        checkout: checkout,
        location: {
          user_location: {
            latitude: location.user_location.latitude,
            longitude: location.user_location.longitude,
          },
          delivery_location: {
            latitude,
            longitude,
          },
        },
      });

      dispatch(clearSelectedItems());
      dispatch(clearCheckoutTotal());
    } catch (err) {
      console.error("Unexpected error:", err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Something went wrong. Please try again later.",
      });
    } finally {
      setLoading(false);
    }

    //socket.emit("send_checkout_notification", { recipientUserId: user_id })
  }

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const _provinces = await getProvincesServerAction();
        setLocation((prev) => ({ ...prev, provinces: _provinces }));
      } catch (error) {
        toast({
          title: "Failed to get provinces",
          variant: "destructive",
          description:
            "Oops! Something went wrong while fetching provinces. Please try again.",
        });
      }
    };

    const fetchUserLocation = () => {
      if (!navigator.geolocation) {
        return toast({
          variant: "destructive",
          title: "Geolocation Not Supported",
          description: "Your browser does not support geolocation.",
        });
      }

      navigator.geolocation.getCurrentPosition(
        ({ coords: { latitude, longitude } }) => {
          setLocation((prev) => ({
            ...prev,
            user_location: { latitude, longitude },
          }));
        },
        () => {
          toast({
            variant: "destructive",
            title: "Oops!",
            description: "Your location is not available for delivery.",
          });
        }
      );
    };

    dispatch(clearLocation());
    fetchProvinces();
    fetchUserLocation();
  }, []);

  useEffect(() => {
    async function getShippingFee() {
      try {
        dispatch(resetShippingFee());
        dispatch(setShippingLoading());
        const response = await getShippingServerAction({
          province_id: location.provice_code,
        });
        if (response.status === 200) {
          dispatch(
            setShippingFee({
              shipping_rate: response.shipping_rate,
              shipping_days: response.shipping_days,
            })
          );
        }
      } catch (error) {
        console.error("Something went wrong while fetching the shipping fee");
      } finally {
        setTimeout(() => {
          dispatch(setShippingLoading());
        }, 2000);
      }
    }
    if (location.provice_code) {
      getShippingFee();
    }
  }, [location.provice_code]);

  // Fetch Cities when Province Changes
  async function handleProvinceChange(province: string) {
    const selectedProvince: any = location.provinces.find(
      (item: any) => item.name === province
    );

    setLocation((prev) => ({ ...prev, provice_code: selectedProvince.code }));

    form.setValue("cities", "");
    form.setValue("barangay", "");
    form.setValue("province", province);

    const cities = await getCitiesServerAction(selectedProvince.code);
    setLocation((prev) => ({ ...prev, cities }));
  }
  // Set the barangay
  async function handleCitiesChange(cityCode: string) {
    form.setValue("cities", cityCode);
    form.setValue("barangay", "");

    const barangays = await getBarangaysServerAction(cityCode);
    setLocation((prev) => ({ ...prev, barangays }));
  }

  return (
    <div className="p-8 rounded shadow h-auto w-full bg-white">
      <h3 className="font-semibold text-sm text-slate-900">
        Personal Information
      </h3>
      <p className="text-slate-500 text-sm">
        Create your product that will be displayed in the shop
      </p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
          <section className="flex items-center justify-between gap-2 flex-wrap md:flex-nowrap">
            <FormField
              control={form.control}
              name="firstname"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="font-medium text-slate-500">
                    First name
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastname"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="font-medium text-slate-500">
                    Last name
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </section>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium text-slate-500">
                  Email
                </FormLabel>
                <FormControl>
                  <Input type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium text-slate-500">
                  Phone
                </FormLabel>
                <FormControl>
                  <Input type="tel" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="province"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium text-slate-500">
                  Province
                </FormLabel>
                <FormControl>
                  <Select
                    onValueChange={handleProvinceChange}
                    value={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your province" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Province</SelectLabel>
                        {location.provinces.map((provinces: any) => (
                          <SelectItem key={provinces.id} value={provinces.name}>
                            {provinces.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <section className="flex items-center justify-between gap-2 flex-wrap md:flex-nowrap">
            <FormField
              control={form.control}
              name="cities"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="font-medium text-slate-500">
                    City
                  </FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={handleCitiesChange}
                      value={field.value}
                      disabled={
                        shipping_fee === null ||
                        Number.isNaN(Number(shipping_fee)) ||
                        Number(shipping_fee) === 0
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your city" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>City</SelectLabel>
                          {location.cities.map((cities: any) => (
                            <SelectItem key={cities.id} value={cities.name}>
                              {cities.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="barangay"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="font-medium text-slate-500">
                    Barangay
                  </FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={
                        shipping_fee === null ||
                        Number.isNaN(Number(shipping_fee)) ||
                        Number(shipping_fee) === 0
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your barangay" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Barangay</SelectLabel>
                          {location.barangays.map((barangay: any) => (
                            <SelectItem key={barangay.id} value={barangay.name}>
                              {barangay.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </section>
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="font-medium text-slate-500">
                  Address
                </FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    {...field}
                    disabled={
                      shipping_fee === null ||
                      Number.isNaN(Number(shipping_fee)) ||
                      Number(shipping_fee) === 0
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="order_policy_aggreement"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center space-x-2">
                <FormControl>
                  <Checkbox
                    id="order_policy_agreement"
                    checked={field.value}
                    onCheckedChange={(checked) =>
                      field.onChange(Boolean(checked))
                    }
                  />
                </FormControl>
                <Label
                  htmlFor="order_policy_agreement"
                  className="text-sm text-gray-700"
                >
                  I agree to the{" "}
                 <CheckoutPolicyModal/>
                </Label>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-700"
            disabled={
              checkout.length <= 0 ||
              shipping_fee === null ||
              Number.isNaN(Number(shipping_fee)) ||
              Number(shipping_fee) === 0
                ? true
                : false
            }
          >
            {loading ? <ButtonLoading text={"Checking out..."} /> : "Checkout"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
