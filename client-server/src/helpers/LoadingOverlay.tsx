import React from "react";

interface LoadingOverlayProps {
    show: boolean;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ show }) => {
    if (!show) {
        return null;
    }

    return (
        <>
            <div className="fixed inset-0 bg-gray-500 opacity-30 z-40"></div>
            <div className="fixed inset-0 flex flex-col items-center justify-center z-50 space-y-3">
                <svg
                    width="190"
                    height="30"
                    viewBox="0 0 190 30"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="#1f2937"
                >
                    <rect x="15" y="5" width="20" height="20">
                    <animate
                        attributeName="opacity"
                        values="1;0.3;1"
                        dur="1.2s"
                        repeatCount="indefinite"
                        begin="0s"
                    />
                    </rect>
                    <rect x="50" y="5" width="20" height="20">
                    <animate
                        attributeName="opacity"
                        values="1;0.3;1"
                        dur="1.2s"
                        repeatCount="indefinite"
                        begin="0.2s"
                    />
                    </rect>
                    <rect x="85" y="5" width="20" height="20">
                    <animate
                        attributeName="opacity"
                        values="1;0.3;1"
                        dur="1.2s"
                        repeatCount="indefinite"
                        begin="0.4s"
                    />
                    </rect>
                    <rect x="120" y="5" width="20" height="20">
                    <animate
                        attributeName="opacity"
                        values="1;0.3;1"
                        dur="1.2s"
                        repeatCount="indefinite"
                        begin="0.6s"
                    />
                    </rect>
                    <rect x="155" y="5" width="20" height="20">
                    <animate
                        attributeName="opacity"
                        values="1;0.3;1"
                        dur="1.2s"
                        repeatCount="indefinite"
                        begin="0.8s"
                    />
                    </rect>
                </svg>
            </div>
        </>
    );
};

export default LoadingOverlay;