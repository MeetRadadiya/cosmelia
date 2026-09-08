"use client";

import { useState, useEffect, useCallback } from "react";
import { commonService } from "../services/commonService";
import { shippingService } from "../services/shippingService";
import { FatherShopsCountry, FatherShopsZone, FatherShopsCity } from "../types";

export function useLocations(
  initialCountryCodeOrId: string = "99",
  checkoutCountries?: FatherShopsCountry[],
  checkoutZones?: FatherShopsZone[]
) {
  const [countries, setCountries] = useState<FatherShopsCountry[]>(checkoutCountries || []);
  const [zones, setZones] = useState<FatherShopsZone[]>(checkoutZones || []);
  const [cities, setCities] = useState<FatherShopsCity[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>(initialCountryCodeOrId);
  const [selectedZone, setSelectedZone] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");

  const [isLoadingCountries, setIsLoadingCountries] = useState(false);
  const [isLoadingZones, setIsLoadingZones] = useState(false);
  const [isLoadingCities, setIsLoadingCities] = useState(false);

  // Use checkout-init countries when available (authoritative ID space for checkout).
  // Fall back to the common countries endpoint for display-only contexts.
  useEffect(() => {
    if (checkoutCountries && checkoutCountries.length > 0) {
      const t = window.setTimeout(() => setCountries(checkoutCountries), 0);
      return () => window.clearTimeout(t);
    }
    if (countries.length > 0) return;

    let mounted = true;
    async function loadCountries() {
      setIsLoadingCountries(true);
      try {
        const res = await commonService.getCountries();
        if (mounted && res.data && Array.isArray(res.data)) {
          setCountries(res.data);
        }
      } catch (err) {
        console.error("Failed to load countries:", err);
      } finally {
        if (mounted) setIsLoadingCountries(false);
      }
    }
    loadCountries();
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkoutCountries]);

  // When selected country changes, load its zones
  const loadZones = useCallback(async (countryIdOrCode: string) => {
    if (!countryIdOrCode) {
      setZones([]);
      setCities([]);
      return;
    }
    setIsLoadingZones(true);
    setZones([]);
    setSelectedZone("");
    setCities([]);
    setSelectedCity("");

    try {
      const res = await commonService.getCountryZones(countryIdOrCode);
      let list: FatherShopsZone[] = [];
      if (res.data) {
        if (Array.isArray(res.data)) {
          list = res.data;
        } else if ("zone" in res.data && Array.isArray(res.data.zone)) {
          list = res.data.zone;
        }
      }
      setZones(list);
    } catch (err) {
      console.error("Failed to load zones:", err);
      setZones([]);
    } finally {
      setIsLoadingZones(false);
    }
  }, []);

  // When selected zone changes, load its cities
  const loadCities = useCallback(async (zoneCodeOrId: string, countryCode: string = "") => {
    if (!zoneCodeOrId) {
      setCities([]);
      return;
    }
    setIsLoadingCities(true);
    setCities([]);
    setSelectedCity("");

    try {
      const res = await commonService.getZoneCities(zoneCodeOrId);
      if (res.data && Array.isArray(res.data) && res.data.length > 0) {
        setCities(res.data);
      } else if (countryCode) {
        // Fallback to Aramex shipping cities if country code is available
        const aramexRes = await shippingService.getShippingCities(countryCode);
        if (aramexRes.data && Array.isArray(aramexRes.data)) {
          setCities(aramexRes.data.map((c: any, idx: number) => ({
            city_id: idx + 1,
            name: typeof c === "string" ? c : c.name || c.city,
          })));
        }
      }
    } catch {
      // Allow fallback to manual text input if cities API returns errors
      setCities([]);
    } finally {
      setIsLoadingCities(false);
    }
  }, []);

  const handleCountryChange = (countryId: string) => {
    setSelectedCountry(countryId);
    loadZones(countryId);
  };

  const handleZoneChange = (zoneIdOrCode: string) => {
    setSelectedZone(zoneIdOrCode);
    const country = countries.find((c) => String(c.country_id) === selectedCountry);
    loadCities(zoneIdOrCode, country?.iso_code_2);
  };

  return {
    countries,
    zones,
    cities,
    selectedCountry,
    selectedZone,
    selectedCity,
    setSelectedCity,
    isLoadingCountries,
    isLoadingZones,
    isLoadingCities,
    handleCountryChange,
    handleZoneChange,
  };
}
