import { create } from "zustand";

interface UiState {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  toggleMobileMenu: () => void;

  bookingModalOpen: boolean;
  bookingModalPackageId: string | null;
  openBookingModal: (packageId?: string | null) => void;
  closeBookingModal: () => void;

  // Active filter state for the packages listing page
  filters: {
    destinationId: string;
    durationDays: string;
    minPrice: number;
    maxPrice: number;
    groupType: string;
    sort: string;
    search: string;
  };
  setFilter: (key: string, value: any) => void;
  resetFilters: () => void;
}

const initialFilters = {
  destinationId: "",
  durationDays: "",
  minPrice: 0,
  maxPrice: 50000,
  groupType: "",
  sort: "newest",
  search: "",
};

export const useUiStore = create<UiState>((set) => ({
  mobileMenuOpen: false,
  setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),
  toggleMobileMenu: () => set((state) => ({ mobileMenuOpen: !state.mobileMenuOpen })),

  bookingModalOpen: false,
  bookingModalPackageId: null,
  openBookingModal: (packageId = null) => set({ bookingModalOpen: true, bookingModalPackageId: packageId }),
  closeBookingModal: () => set({ bookingModalOpen: false, bookingModalPackageId: null }),

  filters: { ...initialFilters },
  setFilter: (key, value) =>
    set((state) => ({
      filters: {
        ...state.filters,
        [key]: value,
      },
    })),
  resetFilters: () => set({ filters: { ...initialFilters } }),
}));
