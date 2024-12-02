import React from 'react'
import { RecommendOptionFormProps } from './types';

const RecommendOptionForm = ({ searchOptionRef, customQueryRef, setIsRecommendClicked, setHasSearchOptionChanged }: RecommendOptionFormProps) => {
    const handleSearchOptionChange = () => {
        setHasSearchOptionChanged(true);
      };

      const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsRecommendClicked(true);
      };
return (
<form ref={searchOptionRef} onSubmit={handleFormSubmit}>
                  <div className="flex gap-4 items-center">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="searchOption"
                        value="hashtags"
                        defaultChecked
                        onChange={handleSearchOptionChange}
                      />
                      Hashtags
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="searchOption"
                        value="embeddings"
                        defaultChecked
                        onChange={handleSearchOptionChange}
                      />
                      Embeddings
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="searchOption"
                        value="emotion"
                        onChange={handleSearchOptionChange}
                      />
                      Emotion
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="searchOption"
                        value="visual"
                        onChange={handleSearchOptionChange}
                      />
                      Visual
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="searchOption"
                        value="conversation"
                        onChange={handleSearchOptionChange}
                      />
                      Conversation
                    </label>
                  </div>
                  <div className="flex items-center gap-2 w-full max-w-md">
                    <label className="flex items-center gap-2 shrink-0">
                      <input
                        type="radio"
                        name="searchOption"
                        value="custom"
                        id="customRadio"
                        onChange={handleSearchOptionChange}
                      />
                      Custom
                    </label>
                    <input
                      type="text"
                      ref={customQueryRef}
                      placeholder="Enter custom search query"
                      className="border px-2 py-1 flex-1 mt-2"
                      onChange={handleSearchOptionChange}
                      onFocus={() => {
                        const customRadio = document.getElementById('customRadio') as HTMLInputElement;
                        if (customRadio) customRadio.checked = true;
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          setIsRecommendClicked(true);
                        }
                      }}
                    />
                  </div>
                </form>
  )
}

export default RecommendOptionForm
