import React, { useState, useRef, useEffect } from 'react';
import { axiosInstance } from '../lib/axios';
import { Button } from "../components/ui/button";
import { Progress } from "../components/ui/progress";
import { CloudIcon, ImageIcon, EditIcon, XIcon } from "lucide-react";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Card, CardContent } from "../components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Badge } from "../components/ui/badge";
import { Command, CommandInput, CommandList, CommandItem } from "../components/ui/command";
import { useDispatch } from 'react-redux';
import {  publishVideo as uploadVideo } from '../redux/features/video.slice';

const Upload = () => {
    const dispatch = useDispatch()
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        videoFile: null,
        thumbnail: null,
        categoryId: '',
        tags: [],
        visibility: 'public'
    });
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploading, setUploading] = useState(false);
    const [videoPreviewUrl, setVideoPreviewUrl] = useState(null);
    const [thumbnailPreviewUrl, setThumbnailPreviewUrl] = useState(null);
    const [categories, setCategories] = useState([]);
    const [availableTags, setAvailableTags] = useState([]);
    const [tagInput, setTagInput] = useState('');
    const [showTagSuggestions, setShowTagSuggestions] = useState(false);
    const videoRef = useRef(null);

    async function fetchCategoriesAndTags(){
        const [tags,categories] =await  Promise.all([axiosInstance.get("/tags"), axiosInstance.get("/category")])
        setCategories(categories.data.data)
        setAvailableTags(tags.data.data)
    }

    useEffect(()=>{
        fetchCategoriesAndTags()
    },[])

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const removeFile = (type) => {
        setFormData(prev => ({ ...prev, [type]: null }));
        if (type === 'videoFile') {
            setVideoPreviewUrl(null);
        } else {
            setThumbnailPreviewUrl(null);
        }
    };

    const handleTagInput = (value) => {
        setTagInput(value);
        setShowTagSuggestions(true);
    };

    const addTag = (tag) => {
        if (formData.tags.length < 10 && !formData.tags.includes(tag)) {
            setFormData(prev => ({
                ...prev,
                tags: [...prev.tags, tag]
            }));
        }
        setTagInput('');
        setShowTagSuggestions(false);
    };

    const removeTag = (tagToRemove) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.filter(tag => tag !== tagToRemove)
        }));
    };

    // Add these handlers after existing handlers
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
    
    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };
    
    const handleDrop = (e, type) => {
        e.preventDefault();
        e.stopPropagation();
        
        const file = e.dataTransfer.files[0];
        if (file) {
            handleFileSelect({ target: { files: [file] } }, type);
        }
    };
    
    const handleUpload = async () => {
        if (!formData.videoFile || !formData.thumbnail || !formData.title.trim() || !formData.description.trim() || !formData.categoryId) {
            alert('Please fill all required fields!');
            return;
        }
    
        const uploadData = new FormData();
        // Append files
        uploadData.append('videoFile', formData.videoFile);
        uploadData.append('thumbnail', formData.thumbnail);
        
        // Append other fields as strings
        uploadData.append('title', formData.title.trim());
        uploadData.append('description', formData.description.trim());
        uploadData.append('categoryId', formData.categoryId);
        
        // Append tags as array
        if (formData.tags.length > 0) {
            formData.tags.forEach(tag => {
                uploadData.append('tags', tag);
            });
        }
        
        setUploading(true);
    
        try {
            const response = await dispatch(uploadVideo({ 
                formData: uploadData,
                onProgress: (progress) => {
                    setUploadProgress(progress);
                }
            })).unwrap();

            alert('Video published successfully!');
            setFormData({
                title: '',
                description: '',
                videoFile: null,
                thumbnail: null,
                categoryId: '',
                tags: [],
                visibility: 'public'
            });
            setVideoPreviewUrl(null);
            setThumbnailPreviewUrl(null);
            setUploadProgress(0);
        } catch (error) {
            console.error('Upload failed:', error);
            alert(error.message || 'Upload failed. Please try again.');
        } finally {
            setUploading(false);
        }
    };
    
    // Add these sections in your JSX for file uploads
    const uploadSections = (
        <>
            <div 
                className="border-2 border-dashed rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, 'videoFile')}
            >
                <input
                    type="file"
                    id="videoFile"
                    accept="video/*"
                    className="hidden"
                    onChange={(e) => handleFileSelect(e, 'videoFile')}
                />
                <label
                    htmlFor="videoFile"
                    className="flex flex-col items-center justify-center cursor-pointer"
                >
                    <CloudIcon className="h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-500">
                        Drag and drop your video or click to browse
                    </p>
                </label>
            </div>
            
            <div 
                className="border-2 border-dashed rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, 'thumbnail')}
            >
                <input
                    type="file"
                    id="thumbnail"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileSelect(e, 'thumbnail')}
                />
                <label
                    htmlFor="thumbnail"
                    className="flex flex-col items-center justify-center cursor-pointer"
                >
                    <ImageIcon className="h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-500">
                        Drag and drop thumbnail or click to browse
                    </p>
                </label>
            </div>
        </>
    );

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

                                    <Select
                                        value={formData.categoryId}
                                        onValueChange={(value) => {
                                            console.log('Selected category:', value);
                                            setFormData(prev => ({ ...prev, categoryId: value }));
                                        }}
                                        disabled={uploading}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select Category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map(category => (
                                                <SelectItem key={category._id} value={category._id}>
                                                    {category.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    <div className="space-y-2">
                                        <label className="text-sm text-muted-foreground">Tags (max 10)</label>
                                        <div className="flex flex-wrap gap-2 mb-2">
                                            {formData.tags.map(tag => (
                                                <Badge 
                                                    key={tag} 
                                                    variant="secondary"
                                                    className="flex items-center gap-1"
                                                >
                                                    {tag}
                                                    <button
                                                        onClick={() => removeTag(tag)}
                                                        className="ml-1 hover:text-destructive"
                                                    >
                                                        <XIcon className="h-3 w-3" />
                                                    </button>
                                                </Badge>
                                            ))}
                                        </div>
                                        <Command className="border rounded-md">
                                            <CommandInput
                                                placeholder="Add tags..."
                                                value={tagInput}
                                                onValueChange={handleTagInput}
                                                disabled={formData.tags.length >= 10 || uploading}
                                            />
                                            {showTagSuggestions && tagInput && (
                                                <CommandList className="max-h-32 overflow-y-auto">
                                                    {availableTags
                                                        .filter(tag => 
                                                            tag.name.toLowerCase().includes(tagInput.toLowerCase()) &&
                                                            !formData.tags.includes(tag.name)
                                                        )
                                                        .map(tag => (
                                                            <CommandItem
                                                                key={tag._id}
                                                                onSelect={() => addTag(tag.name)}
                                                            >
                                                                {tag.name}
                                                            </CommandItem>
                                                        ))}
                                                    {tagInput && !availableTags.some(t => t.name.toLowerCase() === tagInput.toLowerCase()) && (
                                                        <CommandItem onSelect={() => addTag(tagInput)}>
                                                            Create tag "{tagInput}"
                                                        </CommandItem>
                                                    )}
                                                </CommandList>
                                            )}
                                        </Command>
                                    </div>

                                    {/* Video upload section */}
                                    {/* ... rest of the code remains the same ... */}
                                </div>

                                <div className="space-y-6">
                                    {/* Add video upload section */}
                                    {videoPreviewUrl ? (
                                        <div className="relative rounded-lg overflow-hidden bg-black/5">
                                            <video
                                                ref={videoRef}
                                                src={videoPreviewUrl}
                                                className="w-full h-full object-contain"
                                                controls
                                            />
                                            <button
                                                onClick={() => removeFile('videoFile')}
                                                className="absolute top-2 right-2 p-1 bg-black/50 rounded-full text-white hover:bg-black/70"
                                            >
                                                <XIcon className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ) : (
                                        <div 
                                            className="border-2 border-dashed rounded-lg p-8 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                                            onDragOver={handleDragOver}
                                            onDrop={(e) => handleDrop(e, 'videoFile')}
                                        >
                                            <input
                                                type="file"
                                                id="videoFile"
                                                accept="video/*"
                                                className="hidden"
                                                onChange={(e) => handleFileSelect(e, 'videoFile')}
                                            />
                                            <label
                                                htmlFor="videoFile"
                                                className="flex flex-col items-center justify-center cursor-pointer"
                                            >
                                                <CloudIcon className="h-12 w-12 text-gray-400" />
                                                <p className="mt-2 text-sm text-gray-500">
                                                    Drag and drop your video or click to browse
                                                </p>
                                            </label>
                                        </div>
                                    )}

                                    {/* Add thumbnail upload section */}
                                    {thumbnailPreviewUrl ? (
                                        <div className="relative rounded-lg overflow-hidden bg-black/5">
                                            <img
                                                src={thumbnailPreviewUrl}
                                                alt="Thumbnail preview"
                                                className="w-full h-full object-contain"
                                            />
                                            <button
                                                onClick={() => removeFile('thumbnail')}
                                                className="absolute top-2 right-2 p-1 bg-black/50 rounded-full text-white hover:bg-black/70"
                                            >
                                                <XIcon className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ) : (
                                        <div 
                                            className="border-2 border-dashed rounded-lg p-8 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                                            onDragOver={handleDragOver}
                                            onDrop={(e) => handleDrop(e, 'thumbnail')}
                                        >
                                            <input
                                                type="file"
                                                id="thumbnail"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={(e) => handleFileSelect(e, 'thumbnail')}
                                            />
                                            <label
                                                htmlFor="thumbnail"
                                                className="flex flex-col items-center justify-center cursor-pointer"
                                            >
                                                <ImageIcon className="h-12 w-12 text-gray-400" />
                                                <p className="mt-2 text-sm text-gray-500">
                                                    Drag and drop thumbnail or click to browse
                                                </p>
                                            </label>
                                        </div>
                                    )}
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