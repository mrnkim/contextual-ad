import React, { Suspense, useEffect, useState } from 'react'
import { useInfiniteQuery } from "@tanstack/react-query";
import { textToVideoSearch } from '@/hooks/apiHooks';
import { ErrorBoundary } from 'react-error-boundary';
import LoadingSpinner from './LoadingSpinner';
import ErrorFallback from './ErrorFallback';
import { RecommendedAdsProps, RecommendedAdProps } from './types';
import RecommendedPlacements from './RecommendedPlacements';
import { fetchSearchPage } from '@/hooks/apiHooks';
import Button from './Button'
import RecommendedAdItem from './RecommendedAdItem';

export enum SearchOption {
  VISUAL = 'visual',
  CONVERSATION = 'conversation',
  TEXT_IN_VIDEO = 'text_in_video',
  LOGO = 'logo'
}

const RecommendedAds = ({ hashtags, footageVideoId, adsIndexId, selectedFile, setIsRecommendClicked, searchOptionRef, customQueryRef, emotions, footageIndexId, isRecommendClicked, selectedAd, setSelectedAd, selectedChapter, setSelectedChapter }: RecommendedAdsProps) => {
  const [searchOptions, setSearchOptions] = useState<SearchOption[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!isRecommendClicked) return;

    let newQuery = '';
    const radioInputs = Array.from(searchOptionRef.current?.elements || [])
    .filter(el => el.getAttribute('type') === 'radio') as HTMLInputElement[];
    console.log("🚀 > useEffect > radioInputs=", radioInputs)

    if (radioInputs[0]?.checked || radioInputs[3]?.checked || radioInputs[4]?.checked) {
      newQuery = hashtags.slice(0, 3).join(' ');
    } else if (radioInputs[2]?.checked) {
      newQuery = emotions.join(' ');
    } else if (radioInputs[5]?.checked) {
      newQuery = [...hashtags.slice(0,2), customQueryRef.current?.value].join(' ');
    }

    setSearchQuery(newQuery);

    let newSearchOptions: SearchOption[] = [];
    if (radioInputs[0]?.checked || radioInputs[2]?.checked || radioInputs[5]?.checked) {
      newSearchOptions = [
        SearchOption.VISUAL,
        SearchOption.CONVERSATION,
        SearchOption.TEXT_IN_VIDEO,
        SearchOption.LOGO
      ];
    } else if (radioInputs[3]?.checked) {
      newSearchOptions = [SearchOption.VISUAL];
    } else if (radioInputs[4]?.checked) {
      newSearchOptions = [SearchOption.CONVERSATION];
    }

    setSearchOptions(newSearchOptions);

    const handleEmbeddingSearch = async () => {
      if (radioInputs[1]?.checked) {
        try {
          const response = await fetch('/api/embeddingSearch', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
          });
          const data = await response.json();
          console.log('Embedding search response:', {
            status: response.status,
            data: data
          });
        } catch (error) {
          console.error('Error fetching embedding search:', error);
        }
      }
    };

    handleEmbeddingSearch();
    setIsRecommendClicked(false);
  }, [isRecommendClicked, hashtags, emotions]);

  const {
    data: searchData,
    error: searchError,
    isLoading: isSearchLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useInfiniteQuery({
    queryKey: ["search", adsIndexId, searchQuery, searchOptions],
    initialPageParam: null,
    queryFn: async ({ pageParam = null }) => {
        if (pageParam) {
        return fetchSearchPage(pageParam);
      }
      return textToVideoSearch(adsIndexId, searchQuery, searchOptions);
    },
    getNextPageParam: (lastPage) => lastPage.page_info?.next_page_token || null,
    enabled: searchQuery.length > 0 && searchOptions.length > 0 && !selectedFile,
  });

  if (searchError) return <ErrorFallback error={searchError} />;

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <div className="flex flex-row w-full my-5 gap-8">
        {/* Left side - RecommendedPlacements */}
          <div className="w-2/3">
            <RecommendedPlacements
              footageVideoId={footageVideoId}
              footageIndexId={footageIndexId}
              selectedAd={selectedAd}
              adsIndexId={adsIndexId}
              selectedChapter={selectedChapter}
              setSelectedChapter={setSelectedChapter}
            />
          </div>

        {/* Right side - Recommended Ads */}
        <div className="flex flex-col w-1/3">
          <h2 className="text-center text-2xl font-bold my-10">Recommended Ads</h2>

          {(isSearchLoading) && (
            <div className="flex justify-center items-center h-full my-5">
              <LoadingSpinner />
            </div>
          )}

          {searchData?.pages[0]?.data && searchData.pages[0].data.length > 0 && (
            <span className="text-xs font-bold mb-0.5 text-left block">Step 3: Choose an ad</span>
          )}
          <Suspense fallback={<LoadingSpinner />}>
            <div>
              {searchData?.pages[0]?.data && searchData.pages[0].data.length > 0 ? (
                <div className="flex flex-col gap-12 p-2 overflow-y-auto max-h-[calc(100vh-200px)]">
                  {searchData.pages.map((page) =>
                    page.data.map((recommendedAd: RecommendedAdProps["recommendedAd"]) => (
                      <div
                        key={recommendedAd.id}
                        onClick={() => setSelectedAd(recommendedAd)}
                        className={`cursor-pointer ${selectedAd?.id === recommendedAd.id ? 'ring-2 ring-green-600 rounded-lg' : ''}`}
                      >
                        <RecommendedAdItem
                          recommendedAd={recommendedAd}
                          adsIndexId={adsIndexId}
                        />
                      </div>
                    ))
                  )}
                </div>
              ) : (
                !isSearchLoading && <div className='flex justify-center items-center h-full my-5'>No search results found 😿 </div>
              )}

              {hasNextPage && (
                <div className="flex justify-center mt-4">
                  <Button
                    type="button"
                    size="sm"
                    appearance="secondary"
                    onClick={() => fetchNextPage()}
                    disabled={isFetchingNextPage}
                  >
                    <img
                      src={"/more.svg"}
                      alt="more options icon"
                      className="w-4 h-4 mr-1"
                    />
                    Show More
                  </Button>
                </div>
              )}
            </div>
          </Suspense>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default RecommendedAds
