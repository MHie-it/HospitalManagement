import React from 'react'

const Backgound = ({children}) => {
    return (
        <div className="relative min-h-screen w-screen bg-white overflow-hidden">
            {/* Soft Blue Radial Background */}
            <div
                className="absolute inset-0 z-0"
                style={{
                    backgroundImage: `
             radial-gradient(circle at top center, rgba(59, 130, 246, 0.5), transparent 70%)
           `,
                    backgroundColor: "ffffff",
                }}
            />

            {/* Nội dung chính */}
            <div className="relative z-10 ">
                {children}
            </div>
        </div>
    )
}

export default Backgound