import { useState, useEffect, useMemo } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Input,
  Button,
} from '@uhomes/ui-kit';

import { SVGs } from '@/assets/svgs/Index';
import { HostelCard } from '@/shared/hostel-card';
import { getAllProperties, type SavedProperty } from '@/services/property';

interface PriceRange {
  label: string;
  minPrice?: number;
  maxPrice?: number;
}

const PRICE_RANGES: PriceRange[] = [
  { label: 'All Prices' },
  { label: 'Under ₦100,000', maxPrice: 100000 },
  { label: '₦100,000 - ₦200,000', minPrice: 100000, maxPrice: 200000 },
  { label: '₦200,000 - ₦300,000', minPrice: 200000, maxPrice: 300000 },
  { label: '₦300,000 - ₦400,000', minPrice: 300000, maxPrice: 400000 },
  { label: '₦400,000 - ₦500,000', minPrice: 400000, maxPrice: 500000 },
  { label: 'Above ₦500,000', minPrice: 500000 },
];

const SORT_OPTIONS = [
  { value: 'createdAt', label: 'Newest First' },
  { value: 'price', label: 'Price: Low to High' },
  { value: 'rating', label: 'Highest Rated' },
];

export function Hostels() {
  // Properties state
  const [properties, setProperties] = useState<SavedProperty[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Filter states
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');

  // Applied filters (used when "Apply Filters" is clicked)
  const [appliedFilters, setAppliedFilters] = useState({
    search: '',
    location: '',
    minPrice: undefined as number | undefined,
    maxPrice: undefined as number | undefined,
    amenities: [] as string[],
    agentId: '',
    sortBy: 'createdAt',
  });

  // Available options for filters (extracted from properties)
  const availableLocations = useMemo(() => {
    const locations = new Set<string>();
    properties.forEach((prop) => {
      if (prop.location) locations.add(prop.location);
    });
    return Array.from(locations).sort();
  }, [properties]);

  // Fetch properties
  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      try {
        const response = await getAllProperties({
          page,
          limit: 12,
          search: appliedFilters.search || undefined,
          location: appliedFilters.location || undefined,
          minPrice: appliedFilters.minPrice,
          maxPrice: appliedFilters.maxPrice,
          amenities: appliedFilters.amenities.length > 0 ? appliedFilters.amenities : undefined,
          agentId: appliedFilters.agentId || undefined,
          sortBy: appliedFilters.sortBy,
        });

        if (response.data.status === 'success') {
          setProperties(response.data.data.properties || []);
          setTotal(response.data.data.total || 0);
          setTotalPages(response.data.data.totalPages || 1);
        }
      } catch (error) {
        console.error('Error fetching properties:', error);
        setProperties([]);
        setTotal(0);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [page, appliedFilters]);

  // Handle apply filters
  const handleApplyFilters = () => {
    const selectedPriceRange = PRICE_RANGES.find((range) => range.label === priceRange);

    setAppliedFilters({
      search: search.trim(),
      location: location.trim(),
      minPrice: selectedPriceRange?.minPrice,
      maxPrice: selectedPriceRange?.maxPrice,
      amenities: [],
      agentId: '',
      sortBy,
    });
    setPage(1); // Reset to first page when filters change
  };

  // Handle sort change - apply immediately
  const handleSortChange = (newSortBy: string) => {
    setSortBy(newSortBy);
    setAppliedFilters((prev) => ({ ...prev, sortBy: newSortBy }));
    setPage(1); // Reset to first page when sort changes
  };

  // Handle page change
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <div className="lg:px-8 lg:py-5">
        <h1 className="font-semibold text-xl leading-[120%] tracking-[0%] text-black md:text-2xl lg:text-3xl">
          Find Your Perfect Hostel
        </h1>

        <p className="text-[13px] leading-[120%] tracking-[0%] text-[#71717A] md:text-sm mt-1">
          Discover verified hostels near your campus, easily, safely, and within your budget.
        </p>
      </div>

      <div className="hidden lg:block lg:border-t lg:border-t-[#E4E4E4]"></div>

      <div className="lg:p-8">
        <div className="rounded-xl border border-[#E4E4E4] md:flex md:gap-x-2.5 md:items-center lg:justify-between p-6 mt-6 md:mt-9 lg:mt-0">
          <div className="md:w-[52.16%] md:flex md:gap-x-2.5 md:items-center lg:w-[620px]">
            <div className="relative md:w-full">
              <Input
                type="search"
                placeholder="Search hostels"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleApplyFilters();
                  }
                }}
                className="rounded-[5px] border border-[#E1E1E1] text-sm leading-[150%] tracking-[0%] text-[#09090B] pl-11 pr-3 py-2.5"
              />

              <SVGs.MagnifyingGlass className="absolute left-3 top-0 bottom-0 my-auto" />
            </div>

            <Select value={location} onValueChange={setLocation}>
              <SelectTrigger className="w-full rounded-[5px] border border-[#E1E1E1] text-sm leading-[100%] tracking-[0%] text-[#09090B] md:w-full px-3 py-2.5 mt-2.5 md:mt-0">
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={'all'}>All Locations</SelectItem>
                {availableLocations.map((loc) => (
                  <SelectItem key={loc} value={loc}>
                    {loc}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={priceRange} onValueChange={setPriceRange}>
              <SelectTrigger className="hidden lg:flex w-full rounded-[5px] border border-[#E1E1E1] text-sm leading-[100%] tracking-[0%] text-[#09090B] px-3 py-2.5">
                <SelectValue placeholder="Price Range" />
              </SelectTrigger>
              <SelectContent>
                {PRICE_RANGES.map((range) => (
                  <SelectItem key={range.label} value={range.label}>
                    {range.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-between items-center md:justify-start md:gap-x-2.5 md:grow lg:grow-0 mt-2.5 md:mt-0">
            <Select value={priceRange} onValueChange={setPriceRange}>
              <SelectTrigger className="w-[39.11%] rounded-[5px] border border-[#E1E1E1] text-sm leading-[100%] tracking-[0%] text-[#09090B] md:grow lg:hidden px-3 py-2.5">
                <SelectValue placeholder="Price Range" />
              </SelectTrigger>
              <SelectContent>
                {PRICE_RANGES.map((range) => (
                  <SelectItem key={range.label} value={range.label}>
                    {range.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              onClick={handleApplyFilters}
              className="w-[39.11%] gap-x-2 items-center rounded-[5px] border border-[#E4E4E4EE] bg-[#3E78FF] md:w-fit px-4 py-2"
            >
              <SVGs.FunnelFree className="text-white" />
              <span className="font-medium text-sm leading-[150%] tracking-[0%] text-white">
                Apply Filters
              </span>
            </Button>
          </div>
        </div>

        <div className="rounded-xl border border-[#E4E7EC] bg-white shadow-[0px_1px_2px_0px_#1018280D] mt-4">
          <div className="flex justify-between items-center px-4 pt-7.5 pb-4 lg:p-4">
            <h1 className="font-semibold text-lg leading-[120%] tracking-[0%] text-black md:text-xl">
              {loading ? 'Loading...' : `${total} Hostel${total !== 1 ? 's' : ''} Available`}
            </h1>

            <Select value={sortBy} onValueChange={handleSortChange}>
              <SelectTrigger className="w-[149px] rounded border border-[#AFAFAF] text-sm leading-[100%] tracking-[0%] text-[#09090B] px-3 py-2.5">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="border-t border-t-[#E4E7EC]"></div>

          <div className="lg:p-4">
            {loading && properties.length === 0 ? (
              <div className="rounded-2xl border border-[#F4F4F4] bg-[#FDFDFD] p-4">
                <p className="text-center text-[#878FA1] py-8">Loading hostels...</p>
              </div>
            ) : properties.length === 0 ? (
              <div className="rounded-2xl border border-[#F4F4F4] bg-[#FDFDFD] p-4">
                <p className="text-center text-[#878FA1] py-8">
                  No hostels found. Try adjusting your filters.
                </p>
              </div>
            ) : (
              <>
                <div className="rounded-2xl border border-[#F4F4F4] bg-[#FDFDFD] md:grid md:grid-cols-2 md:gap-6 lg:grid-cols-3 p-4">
                  {properties.map((property) => (
                    <HostelCard key={property._id} property={property} />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-x-2 mt-4">
                    <Button
                      variant="outline"
                      onClick={() => handlePageChange(page - 1)}
                      disabled={page === 1 || loading}
                      className="px-4"
                    >
                      Previous
                    </Button>
                    <span className="text-sm text-[#71717A]">
                      Page {page} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      onClick={() => handlePageChange(page + 1)}
                      disabled={page === totalPages || loading}
                      className="px-4"
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
