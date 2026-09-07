import { CommerceProvider } from "./provider";
import { MockCommerceProvider } from "./mock/mock-provider";
import { FatherShopsCommerceProvider } from "../fathershops/adapter";

let providerInstance: CommerceProvider | null = null;

export function getCommerceProvider(): CommerceProvider {
  if (providerInstance) {
    return providerInstance;
  }

  const providerType = (process.env.COMMERCE_PROVIDER || "fathershops").toLowerCase();

  // Mock provider is strictly restricted to development when explicitly flagged
  if (providerType === "mock" && process.env.NODE_ENV === "development") {
    providerInstance = new MockCommerceProvider();
  } else {
    providerInstance = new FatherShopsCommerceProvider();
  }

  return providerInstance;
}
