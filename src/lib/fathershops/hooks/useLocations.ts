"use client";

import { useState, useEffect, useCallback } from "react";
import { commonService } from "../services/commonService";
import { shippingService } from "../services/shippingService";
import { FatherShopsCountry, FatherShopsZone, FatherShopsCity } from "../types";

export const DEFAULT_US_STATES: FatherShopsZone[] = [
  { zone_id: "3613", country_id: "223", name: "Alabama", code: "AL" },
  { zone_id: "3614", country_id: "223", name: "Alaska", code: "AK" },
  { zone_id: "3615", country_id: "223", name: "American Samoa", code: "AS" },
  { zone_id: "3616", country_id: "223", name: "Arizona", code: "AZ" },
  { zone_id: "3617", country_id: "223", name: "Arkansas", code: "AR" },
  { zone_id: "3618", country_id: "223", name: "California", code: "CA" },
  { zone_id: "3619", country_id: "223", name: "Colorado", code: "CO" },
  { zone_id: "3620", country_id: "223", name: "Connecticut", code: "CT" },
  { zone_id: "3621", country_id: "223", name: "Delaware", code: "DE" },
  { zone_id: "3622", country_id: "223", name: "District of Columbia", code: "DC" },
  { zone_id: "3623", country_id: "223", name: "Florida", code: "FL" },
  { zone_id: "3624", country_id: "223", name: "Georgia", code: "GA" },
  { zone_id: "3625", country_id: "223", name: "Guam", code: "GU" },
  { zone_id: "3626", country_id: "223", name: "Hawaii", code: "HI" },
  { zone_id: "3627", country_id: "223", name: "Idaho", code: "ID" },
  { zone_id: "3628", country_id: "223", name: "Illinois", code: "IL" },
  { zone_id: "3629", country_id: "223", name: "Indiana", code: "IN" },
  { zone_id: "3630", country_id: "223", name: "Iowa", code: "IA" },
  { zone_id: "3631", country_id: "223", name: "Kansas", code: "KS" },
  { zone_id: "3632", country_id: "223", name: "Kentucky", code: "KY" },
  { zone_id: "3633", country_id: "223", name: "Louisiana", code: "LA" },
  { zone_id: "3634", country_id: "223", name: "Maine", code: "ME" },
  { zone_id: "3635", country_id: "223", name: "Maryland", code: "MD" },
  { zone_id: "3636", country_id: "223", name: "Massachusetts", code: "MA" },
  { zone_id: "3637", country_id: "223", name: "Michigan", code: "MI" },
  { zone_id: "3638", country_id: "223", name: "Minnesota", code: "MN" },
  { zone_id: "3639", country_id: "223", name: "Mississippi", code: "MS" },
  { zone_id: "3640", country_id: "223", name: "Missouri", code: "MO" },
  { zone_id: "3641", country_id: "223", name: "Montana", code: "MT" },
  { zone_id: "3642", country_id: "223", name: "Nebraska", code: "NE" },
  { zone_id: "3643", country_id: "223", name: "Nevada", code: "NV" },
  { zone_id: "3644", country_id: "223", name: "New Hampshire", code: "NH" },
  { zone_id: "3645", country_id: "223", name: "New Jersey", code: "NJ" },
  { zone_id: "3646", country_id: "223", name: "New Mexico", code: "NM" },
  { zone_id: "3647", country_id: "223", name: "New York", code: "NY" },
  { zone_id: "3648", country_id: "223", name: "North Carolina", code: "NC" },
  { zone_id: "3649", country_id: "223", name: "North Dakota", code: "ND" },
  { zone_id: "3650", country_id: "223", name: "Northern Mariana Islands", code: "MP" },
  { zone_id: "3651", country_id: "223", name: "Ohio", code: "OH" },
  { zone_id: "3652", country_id: "223", name: "Oklahoma", code: "OK" },
  { zone_id: "3653", country_id: "223", name: "Oregon", code: "OR" },
  { zone_id: "3654", country_id: "223", name: "Pennsylvania", code: "PA" },
  { zone_id: "3655", country_id: "223", name: "Puerto Rico", code: "PR" },
  { zone_id: "3656", country_id: "223", name: "Rhode Island", code: "RI" },
  { zone_id: "3657", country_id: "223", name: "South Carolina", code: "SC" },
  { zone_id: "3658", country_id: "223", name: "South Dakota", code: "SD" },
  { zone_id: "3659", country_id: "223", name: "Tennessee", code: "TN" },
  { zone_id: "3660", country_id: "223", name: "Texas", code: "TX" },
  { zone_id: "3661", country_id: "223", name: "Utah", code: "UT" },
  { zone_id: "3662", country_id: "223", name: "Vermont", code: "VT" },
  { zone_id: "3663", country_id: "223", name: "Virgin Islands", code: "VI" },
  { zone_id: "3664", country_id: "223", name: "Virginia", code: "VA" },
  { zone_id: "3665", country_id: "223", name: "Washington", code: "WA" },
  { zone_id: "3666", country_id: "223", name: "West Virginia", code: "WV" },
  { zone_id: "3667", country_id: "223", name: "Wisconsin", code: "WI" },
  { zone_id: "3668", country_id: "223", name: "Wyoming", code: "WY" },
];

function isUSCountry(countryIdOrCode: string): boolean {
  if (!countryIdOrCode) return true;
  return (
    countryIdOrCode === "223" ||
    countryIdOrCode === "99" ||
    countryIdOrCode.toUpperCase() === "US" ||
    countryIdOrCode.toUpperCase() === "USA"
  );
}

export function useLocations(
  initialCountryCodeOrId: string = "223",
  checkoutCountries?: FatherShopsCountry[],
  checkoutZones?: FatherShopsZone[]
) {
  const [countries, setCountries] = useState<FatherShopsCountry[]>(checkoutCountries || []);
  const [zones, setZones] = useState<FatherShopsZone[]>(
    checkoutZones && checkoutZones.length > 0
      ? checkoutZones
      : isUSCountry(initialCountryCodeOrId)
      ? DEFAULT_US_STATES
      : []
  );
  const [cities, setCities] = useState<FatherShopsCity[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>(initialCountryCodeOrId || "223");
  const [selectedZone, setSelectedZone] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");

  const [isLoadingCountries, setIsLoadingCountries] = useState(false);
  const [isLoadingZones, setIsLoadingZones] = useState(false);
  const [isLoadingCities, setIsLoadingCities] = useState(false);

  // Load countries list
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
    const isUS = isUSCountry(countryIdOrCode);
    setIsLoadingZones(true);
    if (isUS) {
      setZones(DEFAULT_US_STATES);
    } else {
      setZones([]);
    }
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
      if (list && list.length > 0) {
        setZones(list);
      } else if (isUS) {
        setZones(DEFAULT_US_STATES);
      }
    } catch (err) {
      console.error("Failed to load zones:", err);
      if (isUS) {
        setZones(DEFAULT_US_STATES);
      }
    } finally {
      setIsLoadingZones(false);
    }
  }, []);

  // Auto load zones on mount & whenever selected country changes
  useEffect(() => {
    if (checkoutZones && checkoutZones.length > 0) return;
    if (selectedCountry) {
      loadZones(selectedCountry);
    }
  }, [selectedCountry, checkoutZones, loadZones]);

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
        const aramexRes = await shippingService.getShippingCities(countryCode);
        if (aramexRes.data && Array.isArray(aramexRes.data)) {
          setCities(aramexRes.data.map((c: any, idx: number) => ({
            city_id: idx + 1,
            name: typeof c === "string" ? c : c.name || c.city,
          })));
        }
      }
    } catch {
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

