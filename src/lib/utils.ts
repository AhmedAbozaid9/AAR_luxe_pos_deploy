import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Dynamic pricing utilities
export interface PriceItem {
  group_type_car_id: number;
  price: number;
}

/**
 * Get the price for a specific car group from an array of prices
 * @param prices Array of price objects with group_type_car_id and price
 * @param carGroupId The car group ID to find the price for
 * @returns The price for the specified car group, or null if not found
 */
export function getPriceForCarGroup(
  prices: PriceItem[],
  carGroupId: number | null
): number | null {
  if (!carGroupId || !prices || prices.length === 0) {
    return null;
  }

  const priceItem = prices.find((p) => p.group_type_car_id === carGroupId);
  return priceItem ? priceItem.price : null;
}

/**
 * Get the minimum price from an array of prices (fallback when no car is selected)
 * @param prices Array of price objects
 * @returns The minimum price, or null if no prices available
 */
export function getMinPrice(prices: PriceItem[]): number | null {
  if (!prices || prices.length === 0) {
    return null;
  }

  return Math.min(...prices.map((p) => p.price));
}

/**
 * Format price for display
 * @param price The price to format
 * @param currency The currency symbol (default: "AED")
 * @returns Formatted price string or "Price on request" if price is null
 */
export function formatPrice(
  price: number | null,
  currency: string = "AED"
): string {
  if (price === null || price === undefined) {
    return "Price on request";
  }

  return `${price.toLocaleString()} ${currency}`;
}
