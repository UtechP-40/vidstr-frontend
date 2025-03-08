import React, { useState, useRef } from 'react';
import axios from 'axios';
import { Button } from "../components/ui/button";
import { Progress } from "../components/ui/progress";
import { CloudIcon, ImageIcon, EditIcon, XIcon } from "lucide-react";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Card, CardContent } from "../components/ui/card";

const Upload = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        videoFile: null,
        thumbnail: null
    });
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploading, setUploading] = useState(false);
    const [videoPreviewUrl, setVideoPreviewUrl] = useState(null);
    const [thumbnailPreviewUrl, setThumbnailPreviewUrl] = useState(null);
    const videoRef = useRef(null);

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e, type) => {
        e.preventDefault();
        e.stopPropagation();
        
        const file = e.dataTransfer.files[0];
        if (file) {
            const validTypes = type === 'videoFile' 
                ? ['video/mp4', 'video/webm', 'video/ogg']
                : ['image/jpeg', 'image/png', 'image/gif'];

            if (validTypes.includes(file.type)) {
                handleFileSelect({ target: { files: [file] } }, type);
            } else {
                alert(`Please upload a valid ${type === 'videoFile' ? 'video' : 'image'} file`);
            }
        }
    };

    const handleFileSelect = (event, type) => {
        const file = event.target.files[0];
        if (file) {
            const validTypes = type === 'videoFile' 
                ? ['video/mp4', 'video/webm', 'video/ogg']
                : ['image/jpeg', 'image/png', 'image/gif'];

            if (validTypes.includes(file.type)) {
                setFormData(prev => ({ ...prev, [type]: file }));
                const url = URL.createObjectURL(file);
                if (type === 'videoFile') {
                    setVideoPreviewUrl(url);
                } else {
                    setThumbnailPreviewUrl(url);
                }
            } else {
                alert(`Please upload a valid ${type === 'videoFile' ? 'video' : 'image'} file`);
            }
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleUpload = async () => {
        if (!formData.videoFile || !formData.thumbnail || !formData.title || !formData.description) {
            alert('Please fill all required fields!');
            return;
        }

        const uploadData = new FormData();
        uploadData.append('videoFile', formData.videoFile);
        uploadData.append('thumbnail', formData.thumbnail);
        uploadData.append('title', formData.title);
        uploadData.append('description', formData.description);
        
        setUploading(true);

        try {
            const response = await axios.post('/api/videos', uploadData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: (progressEvent) => {
                    const progress = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    );
                    setUploadProgress(progress);
                },
            });

            alert('Video published successfully!');
            setFormData({
                title: '',
                description: '',
                videoFile: null,
                thumbnail: null
            });
            setUploadProgress(0);
        } catch (error) {
            console.error('Upload failed:', error);
            alert(error.response?.data?.message || 'Upload failed. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    const removeFile = (type) => {
        setFormData(prev => ({ ...prev, [type]: null }));
        if (type === 'videoFile') {
            setVideoPreviewUrl(null);
        } else {
            setThumbnailPreviewUrl(null);
        }
    };

    return (
        <div className="min-h-screen bg-background py-12">
            <div className="container max-w-4xl mx-auto px-4">
                <Card className="bg-card border-border shadow-lg">
                    <CardContent className="p-6">
                        <div className="space-y-8">
                            <div className="text-center">
                                <h1 className="text-3xl font-bold text-foreground">Upload Video</h1>
                                <p className="text-muted-foreground mt-2">Share your video with the world</p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <Input
                                        type="text"
                                        name="title"
                                        placeholder="Video Title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        disabled={uploading}
                                        className="w-full"
                                    />

                                    <Textarea
                                        name="description"
                                        placeholder="Video Description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        disabled={uploading}
                                        className="w-full min-h-[150px]"
                                    />

                                    {videoPreviewUrl ? (
                                        <div className="relative rounded-lg overflow-hidden bg-black/5 aspect-video">
                                            <video
                                                ref={videoRef}
                                                src={videoPreviewUrl}
                                                className="w-full h-full object-contain"
                                                controls
                                            />
                                            <button
                                                onClick={() => removeFile('videoFile')}
                                                className="absolute top-2 right-2 p-1 bg-background/80 rounded-full hover:bg-background"
                                            >
                                                <XIcon className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ) : (
                                        <div
                                            onDragOver={handleDragOver}
                                            onDrop={(e) => handleDrop(e, 'videoFile')}
                                            className="relative"
                                        >
                                            <input
                                                accept="video/mp4,video/webm,video/ogg"
                                                className="hidden"
                                                id="video-upload"
                                                type="file"
                                                onChange={(e) => handleFileSelect(e, 'videoFile')}
                                            />
                                            <label 
                                                htmlFor="video-upload"
                                                className="block cursor-pointer"
                                            >
                                                <div className="w-full h-40 border-2 border-dashed rounded-lg hover:border-primary transition-colors duration-200 flex flex-col items-center justify-center gap-2">
                                                    <CloudIcon className="h-8 w-8 text-muted-foreground" />
                                                    <p className="text-muted-foreground text-center">
                                                        Drag and drop video here or click to browse
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        Supported formats: MP4, WebM, OGG
                                                    </p>
                                                </div>
                                            </label>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-6">
                                    {thumbnailPreviewUrl ? (
                                        <div className="relative rounded-lg overflow-hidden aspect-video">
                                            <img
                                                src={thumbnailPreviewUrl}
                                                alt="Thumbnail preview"
                                                className="w-full h-full object-cover"
                                            />
                                            <button
                                                onClick={() => removeFile('thumbnail')}
                                                className="absolute top-2 right-2 p-1 bg-background/80 rounded-full hover:bg-background"
                                            >
                                                <XIcon className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ) : (
                                        <div
                                            onDragOver={handleDragOver}
                                            onDrop={(e) => handleDrop(e, 'thumbnail')}
                                            className="relative"
                                        >
                                            <input
                                                accept="image/jpeg,image/png,image/gif"
                                                className="hidden"
                                                id="thumbnail-upload"
                                                type="file"
                                                onChange={(e) => handleFileSelect(e, 'thumbnail')}
                                            />
                                            <label 
                                                htmlFor="thumbnail-upload"
                                                className="block cursor-pointer"
                                            >
                                                <div className="w-full h-40 border-2 border-dashed rounded-lg hover:border-primary transition-colors duration-200 flex flex-col items-center justify-center gap-2">
                                                    <ImageIcon className="h-8 w-8 text-muted-foreground" />
                                                    <p className="text-muted-foreground text-center">
                                                        Drag and drop thumbnail here or click to browse
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        Supported formats: JPEG, PNG, GIF
                                                    </p>
                                                </div>
                                            </label>
                                        </div>
                                    )}

                                    <Card className="border border-border">
                                        <CardContent className="p-4 space-y-4">
                                            <h3 className="text-lg font-semibold">Video Settings</h3>
                                            <div className="space-y-2">
                                                <label className="text-sm text-muted-foreground">Privacy</label>
                                                <select className="w-full rounded-md border border-input bg-background px-3 py-2">
                                                    <option value="public">Public</option>
                                                    <option value="private">Private</option>
                                                    <option value="unlisted">Unlisted</option>
                                                </select>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>

                            {uploading && (
                                <div className="w-full space-y-2">
                                    <Progress value={uploadProgress} className="w-full" />
                                    <p className="text-sm text-center text-muted-foreground">
                                        Uploading... {uploadProgress}%
                                    </p>
                                </div>
                            )}

                            <div className="flex justify-end gap-4">
                                <Button variant="outline" disabled={uploading}>
                                    Save Draft
                                </Button>
                                <Button
                                    className="min-w-[150px]"
                                    onClick={handleUpload}
                                    disabled={!formData.videoFile || !formData.thumbnail || !formData.title || !formData.description || uploading}
                                >
                                    {uploading ? 'Publishing...' : 'Publish Video'}
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Upload;