import { loadWhopElements } from "@whop/embedded-components-vanilla-js";

let elementsPromise: ReturnType<typeof loadWhopElements> | null = null;

/**
 * Returns a singleton WhopElements instance.
 * Use this in client components to avoid re-initializing on every render.
 */
export function getWhopElements() {
	if (!elementsPromise) {
		elementsPromise = loadWhopElements();
	}
	return elementsPromise;
}
