import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useRef } from 'react';
/**
 * FlightSearch Component
 * Integrated Travelpayouts Module - LionGateOS Logic-Only compliant.
 */
export const FlightSearch = () => {
    const containerRef = useRef(null);
    useEffect(() => {
        const script = document.createElement('script');
        script.src = "https://tpwgt.com/content?currency=cad&campaign_id=100&promo_id=7879&plain=true&no_labels=&border_radius=21&color_focused=%2332a8dd&special=%23C4C4C4&secondary=%236637DCff&light=%23FFFFFF&dark=%23262626&color_icons=%2332a8dd&color_button=%2332a8dd&primary_override=%2332a8dd&searchUrl=www.aviasales.com%2Fsearch&locale=en&powered_by=true&show_hotels=true&shmarker=701220&trs=495278";
        script.async = true;
        script.charset = "utf-8";
        if (containerRef.current) {
            containerRef.current.appendChild(script);
        }
        return () => {
            if (containerRef.current) {
                containerRef.current.innerHTML = '';
            }
        };
    }, []);
    return (_jsx("div", { className: "search-matrix-container", ref: containerRef, style: { minHeight: '400px' } }));
};
