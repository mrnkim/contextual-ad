"use client";

import React, { useState, useEffect} from 'react'
import Video from './Video';
import LoadingSpinner from './LoadingSpinner';
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Task from './Task';
import Button from './Button'
import FootageSummary from './FootageSummary';
import { fetchVideos, fetchTaskDetails } from '@/hooks/apiHooks';
import { TaskDetails } from './types';
import UploadForm from './UploadForm';
import { FootageProps } from './types';
import VideosDropDown from './VideosDropDown';

const PAGE = 1;

function Footage({ hashtags, setHashtags, indexId, isIndexIdLoading, footageVideoId, setFootageVideoId, selectedFile, setSelectedFile, setIsRecommendClicked }: FootageProps) {
	const [isAnalyzeClicked, setIsAnalyzeClicked] = useState(false);
	const [taskId, setTaskId] = useState<string | null>(null);
	const [taskDetails, setTaskDetails] = useState<TaskDetails | null>(null);
	const [playing, setPlaying] = useState(false);

	const handleVideoChange = (selectedVideoId: string) => {
		reset();
		setFootageVideoId(selectedVideoId);
		queryClient.invalidateQueries({ queryKey: ['videos'] });
	};

	const { data: videos, isLoading: isVideosLoading } = useQuery({
		queryKey: ['videos', PAGE, indexId],
		queryFn: () => fetchVideos(PAGE, indexId),
		enabled: !!indexId && !isIndexIdLoading,
	});

	const queryClient = useQueryClient();
	const hasVideoData = videos?.data && videos?.data?.length > 0;

	const reset = () => {
		setIsAnalyzeClicked(false);
		setSelectedFile(null);
		setTaskId(null);
		setTaskDetails(null);
		setHashtags([]);
		setIsRecommendClicked(false)
		queryClient.invalidateQueries({ queryKey: ['videos'] });
		queryClient.invalidateQueries({ queryKey: ['gist'] });
		queryClient.invalidateQueries({ queryKey: ['search'] });
		queryClient.invalidateQueries({ queryKey: ['customTexts'] });
		queryClient.invalidateQueries({ queryKey: ['adCopy'] });
	};

	useEffect(() => {
		let intervalId: NodeJS.Timeout | null = null;

		if (taskId) {
			const fetchTask = async () => {
				try {
					const details = await fetchTaskDetails(taskId);
					setTaskDetails(details);

					if (details.status === 'ready' || details.status === 'failed') {
						if (intervalId) {
							clearInterval(intervalId);
						}
						reset();
					}
				} catch (error) {
					console.error('Error fetching task details:', error);
				}
			};

			fetchTask();
			intervalId = setInterval(fetchTask, 5000);
		}

		return () => {
			if (intervalId) {
				clearInterval(intervalId);
			}
		};
	}, [queryClient, setHashtags, setIsRecommendClicked, setSelectedFile, taskId]);

	// useEffect(() => {
	// 	if (videos?.data?.[0]?._id) {
	// 		setFootageVideoId(videos.data[0]._id);
	// 	}
	// }, [setFootageVideoId, videos]);

	// useEffect(() => {
	// 	queryClient.invalidateQueries({ queryKey: ['videos'] });
	// }, [queryClient, videos]);

	return (
		<div className="flex flex-col items-center gap-4 w-full">
			<h2 className="text-2xl font-bold">News Footage</h2>
			<div className="flex items-center justify-center w-full">
				<div className="flex-grow mr-4 w-64">
					<VideosDropDown
						indexId={indexId}
						onVideoChange={handleVideoChange}
					/>
				</div>
				<div className="flex-shrink-0">
					<UploadForm
						indexId={indexId}
						selectedFile={selectedFile}
						setSelectedFile={setSelectedFile}
						setTaskId={setTaskId}
						taskId={taskId}
					/>
				</div>
			</div>
			{taskId && taskDetails && (
				<Task taskDetails={taskDetails} playing={playing} setPlaying={setPlaying} />
			)}
			{!selectedFile && (
				<>
					{isIndexIdLoading || isVideosLoading ? (
						<LoadingSpinner />
					) : !hasVideoData ? (
						<div>No videos available</div>
					) : (
						<>
							<Video videoId={footageVideoId} indexId={indexId || ''} />
							<Button
								type="button"
								size="sm"
								appearance="primary"
								onClick={() => setIsAnalyzeClicked(true)}
								disabled={isAnalyzeClicked}
							>
								<img
									src={isAnalyzeClicked ? "/analyzeDisabled.svg" : "/analyze.svg"}
									alt="magic stick icon"
									className="w-4 h-4"
								/>
								Analyze
							</Button>
						</>
					)}
				</>
			)}
			{!selectedFile && isAnalyzeClicked && hasVideoData && (
				<FootageSummary videoId={footageVideoId} hashtags={hashtags} setHashtags={setHashtags} />
			)}
		</div>
	)
}

export default Footage
