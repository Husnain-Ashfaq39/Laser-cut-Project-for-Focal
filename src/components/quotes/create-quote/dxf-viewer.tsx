import React, { useEffect, useRef, useState } from 'react';
import { DxfViewer as DxfViewerLib } from 'dxf-viewer';
import * as THREE from 'three';
import { DxfViewerWorker } from '@/services/dxf-worker';

const DxfViewer = ({ dxfUrl, fonts, options }) => {
    const viewerRef = useRef(null);
    const [isLoading, setIsLoading] = useState(false);
    const [progress, setProgress] = useState(null);
    const [progressText, setProgressText] = useState(null);
    const [error, setError] = useState(null);
    const [viewer, setViewer] = useState(null);

    useEffect(() => {
        if (viewerRef.current && !viewer) {
            const newViewer = new DxfViewerLib(viewerRef.current, options);
            setViewer(newViewer);
        }
    }, [viewerRef.current]);

    useEffect(() => {
        if (viewer && dxfUrl) {
            loadDxf(dxfUrl);
        } else if (viewer) {
            viewer.Clear();
            setError(null);
            setIsLoading(false);
            setProgress(null);
        }
    }, [dxfUrl, viewer]);

    const loadDxf = async (url) => {
        setIsLoading(true);
        setError(null);

        try {
            await viewer.Load({
                url,
                fonts,
                progressCbk: onProgress,
                workerFactory: DxfViewerWorker
            });
        } catch (error) {
            console.warn(error);
            setError(error.toString());
        } finally {
            setIsLoading(false);
            setProgressText(null);
            setProgress(null);
        }
    };

    const onProgress = (phase, size, totalSize) => {
        switch (phase) {
            case 'font':
                setProgressText('Fetching fonts...');
                break;
            case 'fetch':
                setProgressText('Fetching file...');
                break;
            case 'parse':
                setProgressText('Parsing file...');
                break;
            case 'prepare':
                setProgressText('Preparing rendering data...');
                break;
            default:
                break;
        }
        if (totalSize === null) {
            setProgress(-1);
        } else {
            setProgress(size / totalSize);
        }
    };

    return (
        <div className="canvasContainer" ref={viewerRef} style={{ width: '100%', height: '100%', pointerEvents: 'none' }}>
            {isLoading && <div>Loading...</div>}
            {progress !== null && (
                <div className="progress">
                    <progress max="100" value={progress * 100}></progress>
                    {progressText && <div className="progressText">{progressText}</div>}
                </div>
            )}
            {error && (
                <div className="error" title={error}>
                    <span>Error occurred: {error}</span>
                </div>
            )}
        </div>
    );
};

DxfViewer.defaultProps = {
    fonts: [],
    options: {
        clearColor: new THREE.Color('#fff'),
        autoResize: true,
        colorCorrection: true,
        sceneOptions: {
            wireframeMesh: true,
        }
    }
};

export default DxfViewer;
