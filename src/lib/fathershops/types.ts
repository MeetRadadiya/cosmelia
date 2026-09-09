/**
 * Raw FatherShops API Contracts & DTOs matching the OpenAPI Specification.
 */

export interface FatherShopsApiResponse<T = any> {
  data: T;
  errors?: any;
  code?: number;
  status?: string;
  response?: any;
  message?: string;
}

// --------------------------------------------------------------------------
// Account / Customer API Contracts (discovered from live FatherShops API)
// --------------------------------------------------------------------------

export interface FatherShopsCustomer {
  firstname?: string;
  lastname?: string;
  email?: string;
  telephone?: string;
  telephone_country_code?: string;
  customer_id?: string | number;
  custom_fields?: any[];
  account_custom_field?: any[];
  newsletter?: string | number;
}

export interface FatherShopsAuthResponse {
  customer_id?: string | number;
  session?: string;
  customer?: FatherShopsCustomer;
  access_token?: string;
  refresh_token?: string;
  expires_in?: string;
}

export interface FatherShopsAddress {
  address_id?: string | number;
  firstname?: string;
  lastname?: string;
  company?: string;
  address_1?: string;
  address_2?: string;
  city?: string;
  postcode?: string;
  country_id?: string | number;
  zone_id?: string | number;
  country?: string;
  zone?: string;
  default?: string | number | boolean;
  is_default?: string | number | boolean;
}

export interface FatherShopsOrderSummary {
  order_id?: string | number;
  order_number?: string | number;
  name?: string;
  email?: string;
  telephone?: string;
  date_added?: string;
  payment_method?: string;
  shipping_method?: string;
  total?: string | number;
  currency_code?: string;
  currency_value?: string | number;
  order_status_id?: string | number;
  order_status?: string;
  status?: string;
  products?: Array<{
    order_product_id?: string | number;
    product_id?: string | number;
    name?: string;
    model?: string;
    quantity?: string | number;
    price?: string | number;
    total?: string | number;
    tax?: string | number;
    reward?: string | number;
    option?: Array<{ name: string; value: string }>;
    image?: string;
    thumb?: string;
    href?: string;
  }>;
  totals?: Array<{
    title?: string;
    text?: string;
    value?: string | number;
    code?: string;
  }>;
  shipping_address?: Partial<FatherShopsAddress>;
  payment_address?: Partial<FatherShopsAddress>;
  comment?: string;
}

export interface FatherShopsWishlistData {
  products?: FatherShopsRawProduct[];
  count?: number;
}

export interface FatherShopsTrackerItem {
  order_id?: string | number;
  tracking_code?: string;
  carrier?: string;
  status?: string;
  status_text?: string;
  date?: string;
  description?: string;
  history?: Array<{
    date: string;
    status: string;
    location?: string;
    description?: string;
  }>;
}

export interface FatherShopsNewsletterData {
  newsletter?: string | number;
}

export interface FatherShopsTransaction {
  transaction_id?: string | number;
  order_id?: string | number;
  description?: string;
  amount?: string | number;
  date_added?: string;
}

export interface FatherShopsReward {
  reward_id?: string | number;
  order_id?: string | number;
  description?: string;
  points?: string | number;
  date_added?: string;
}

export interface FatherShopsCommonData {
  session_id: string;
  name: string;
  logo: string;
  logo2x?: string;
  logo_width?: number;
  logo_height?: number;
  favicon?: string;
  currency?: string;
  language?: string;
  checkout_link?: string;
}

export interface FatherShopsRawOptionValue {
  product_option_value_id: string | number;
  option_value_id: string | number;
  name?: string;
  image?: string;
  price?: string | number;
  price_prefix?: string;
  descriptions?: Record<string, { name: string }>;
}

export interface FatherShopsRawOption {
  product_option_id: string | number;
  option_id?: string | number;
  name?: string;
  type?: string;
  required?: string | number | boolean;
  value?: string;
  descriptions?: Record<string, { name?: string }>;
  product_option_value?: FatherShopsRawOptionValue[];
}

export interface FatherShopsRawProduct {
  product_id: string | number;
  id?: string | number;
  name?: string;
  title?: string;
  descriptions?: Record<string, {
    name?: string;
    description?: string;
    meta_title?: string;
    meta_description?: string;
  }>;
  description?: string;
  short_description?: string;
  model?: string;
  manufacturer?: string | null;
  weight?: string | number;
  price?: string | number;
  special?: string | number | boolean;
  compare_price?: string | number;
  tax?: string | number;
  currency?: string;
  rating?: number | string;
  reviews?: number | string;
  minimum?: number | string;
  stock?: boolean | string | number;
  thumb?: string;
  thumb2x?: string;
  second_thumb?: string;
  popup?: string;
  image?: string;
  images?: Array<{ popup?: string; thumb?: string } | string>;
  category?: { id?: string | number; name?: string; slug?: string };
  category_id?: string | number;
  categories?: any[];
  tags?: string[] | string;
  sku?: string;
  options?: FatherShopsRawOption[];
  attribute_groups?: Array<{
    attribute_group_id: string | number;
    name: string;
    attribute: Array<{
      attribute_id: string | number;
      name: string;
      text: string;
    }>;
  }>;
  products?: FatherShopsRawProduct[];
  href?: string;
  slug?: string;
  quantity?: number;
  variants?: any[];
}

export interface FatherShopsRawCategory {
  category_id: string | number;
  id?: string | number;
  name: string;
  slug?: string;
  description?: string;
  thumb?: string;
  image?: string;
  total_products?: number;
  parent_id?: string | number;
  href?: string;
  children?: FatherShopsRawCategory[];
}

export interface FatherShopsRawCartItem {
  cart_id: string | number;
  key?: string | number;
  product_id: string | number;
  name: string;
  model?: string;
  thumb?: string;
  image?: string;
  quantity: string | number;
  price: string | number;
  total: string | number;
  option?: Array<{
    name: string;
    value: string;
    product_option_id?: string | number;
    product_option_value_id?: string | number;
  }>;
  stock?: boolean;
  href?: string;
}

export interface FatherShopsRawCartTotal {
  title: string;
  text: string;
  value?: string | number;
  code?: string;
  sort_order?: string | number;
}

export interface FatherShopsRawCart {
  products?: FatherShopsRawCartItem[];
  items?: FatherShopsRawCartItem[];
  totals?: FatherShopsRawCartTotal[];
  total?: string | number;
  cart_count?: number;
  total_saving?: string | number | boolean;
  coupon?: string;
  vouchers?: any[];
  weight?: string;
  text_error?: string;
  success?: string | Record<string, string>;
  attention?: string;
}

export interface FatherShopsCountry {
  country_id: string | number;
  name: string;
  iso_code_2: string;
  iso_code_3: string;
  country_code?: string;
  currency?: string;
  currency_name?: string;
  currency_symbol?: string;
  postcode_required?: number;
}

export interface FatherShopsZone {
  zone_id: string | number;
  country_id: string | number;
  name: string;
  code: string;
  iso_code_2?: string;
}

export interface FatherShopsCity {
  city_id: string | number;
  name: string;
  zone_id?: string | number;
}

export interface FatherShopsCurrency {
  currency_id?: string | number;
  code: string;
  title: string;
  symbol_left?: string;
  symbol_right?: string;
  value?: string | number;
  decimal_place?: string | number;
  status?: string | number | boolean;
}

export interface FatherShopsLanguage {
  id?: string | number;
  language_id?: string | number;
  name: string;
  label?: string;
  code: string;
  return_code?: string;
  status?: string | number | boolean;
  image?: string;
  directory?: string;
}

export interface FatherShopsOrderData {
  customer_id?: number | string;
  firstname: string;
  lastname: string;
  email: string;
  telephone: string;
  payment_firstname?: string;
  payment_lastname?: string;
  payment_company?: string;
  payment_address_1?: string;
  payment_address_2?: string;
  payment_city?: string;
  payment_postcode?: string;
  payment_country_id?: number | string;
  payment_country?: string;
  payment_zone_id?: number | string;
  payment_zone?: string;
  payment_iso_code_2?: string;
  payment_method?: string;
  payment_code?: string;
  shipping_firstname?: string;
  shipping_lastname?: string;
  shipping_company?: string;
  shipping_address_1?: string;
  shipping_address_2?: string;
  shipping_city?: string;
  shipping_postcode?: string;
  shipping_country_id?: number | string;
  shipping_country?: string;
  shipping_zone_id?: number | string;
  shipping_zone?: string;
  shipping_iso_code_2?: string;
  shipping_method?: string;
  shipping_code?: string;
  comment?: string;
  total?: number | string;
  totals?: FatherShopsRawCartTotal[];
  products?: any[];
  agree?: boolean;
  privacy?: boolean;
  custom_field?: Record<string, any>;
}

export interface FatherShopsCheckoutInitData {
  checkout_id?: string;
  order_id?: string | number;
  heading_title?: string;
  error_warning?: string;
  checkout_data?: {
    checkout_id?: string;
    order_data?: FatherShopsOrderData;
    shipping_methods?: Record<string, {
      title: string;
      quote: Record<string, {
        code: string;
        title: string;
        cost: string | number;
        text: string;
      }>;
      sort_order?: string | number;
      error?: boolean;
    }>;
    payment_methods?: Record<string, {
      code: string;
      title: string;
      terms?: string;
      sort_order?: number | string;
    }>;
    countries?: FatherShopsCountry[];
    shipping_zones?: FatherShopsZone[];
    payment_zones?: FatherShopsZone[];
    products?: any[];
    totals?: FatherShopsRawCartTotal[];
    total?: number | string;
    coupon?: string;
    agree?: boolean;
    privacy?: boolean;
    checkout_link?: string;
  };
}
