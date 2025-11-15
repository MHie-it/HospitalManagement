import React from 'react'

const BackgroundUser = ({ children }) => {
    return (
        <div className="relative min-h-screen w-screen bg-white overflow-hidden">
            {/* Radial Gradient Background */}
            <div
                className="absolute inset-0 z-0"
                style={{
                    background: "radial-gradient(125% 125% at 50% 10%, #fff 40%, #6366f1 100%)",
                }}
            />
            {/* Your Content/Components */}
            <div className="relative z-10 ">
                {children}
            </div>
        </div>
    )
}

export default BackgroundUser