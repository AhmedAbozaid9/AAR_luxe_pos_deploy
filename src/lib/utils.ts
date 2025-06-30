import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { PackagePrice } from "../api/getPackages";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Dynamic pricing utilities
// Interface for basic price item (to maintain backward compatibility)
export interface PriceItem {
  group_type_car_id: number;
  price: number;
}

/**
 * Get the price for a specific car group from an array of prices
 * @param prices Array of PackagePrice objects
 * @param carGroupId The car group ID to find the price for
 * @returns The price for the specified car group, or null if not found
 */
export function getPriceForCarGroup(
  prices: PackagePrice[],
  carGroupId: number | null
): number | null {
  if (!carGroupId || !prices || prices.length === 0) {
    console.log("getPriceForCarGroup: Invalid input", {
      carGroupId,
      pricesLength: prices?.length,
    });
    return null;
  }

  console.log("getPriceForCarGroup: Looking for car group ID:", carGroupId);
  console.log(
    "getPriceForCarGroup: Available prices:",
    prices.map((p) => ({
      id: p.id,
      group_type_car_id: p.group_type_car_id,
      price: p.price,
      type: typeof p.group_type_car_id,
      priceType: typeof p.price,
    }))
  );

  // Convert carGroupId to number to ensure proper comparison
  const carGroupIdNum = Number(carGroupId);

  const priceItem = prices.find((p) => {
    const groupTypeCarIdNum = Number(p.group_type_car_id);
    console.log(`Comparing ${groupTypeCarIdNum} === ${carGroupIdNum}`);
    return groupTypeCarIdNum === carGroupIdNum;
  });

  console.log("getPriceForCarGroup: Found price item:", priceItem);

  // Return null if price is 0 or if no price item found
  return priceItem && priceItem.price > 0 ? priceItem.price : null;
}

/**
 * Get the minimum price from an array of prices (fallback when no car is selected)
 * @param prices Array of PackagePrice objects
 * @returns The minimum price, or null if no prices available
 */
export function getMinPrice(prices: PackagePrice[]): number | null {
  if (!prices || prices.length === 0) {
    console.log("getMinPrice: No prices available");
    return null;
  }

  console.log(
    "getMinPrice: Calculating min from prices:",
    prices.map((p) => p.price)
  );

  // Filter out prices that are 0 or negative
  const validPrices = prices.filter((p) => p.price > 0).map((p) => p.price);

  if (validPrices.length === 0) {
    console.log(
      "getMinPrice: No valid prices available (all are 0 or negative)"
    );
    return null;
  }

  const minPrice = Math.min(...validPrices);
  console.log("getMinPrice: Minimum price found:", minPrice);
  return minPrice;
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
