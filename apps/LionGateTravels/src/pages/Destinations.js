import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { DESTINATIONS } from '../data/Reference_Data';
import { UniversalDestinationTemplate } from '../components/UniversalDestinationTemplate';
export const Destinations = () => {
    return (_jsxs("div", { style: { padding: '0 20px 40px' }, children: [_jsxs("div", { style: { marginBottom: '40px', textAlign: 'center' }, children: [_jsx("h1", { style: { fontSize: '36px', marginBottom: '10px', background: 'linear-gradient(to right, var(--lg-accent), var(--lg-accent-2))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }, children: "Global Destinations" }), _jsx("p", { style: { opacity: 0.8, maxWidth: '600px', margin: '0 auto' }, children: "Explore curated decision environments designed for preparation, pacing, and real-world tradeoffs." })] }), _jsx("h2", { style: { marginTop: '30px', borderBottom: '1px solid var(--lg-stroke)', paddingBottom: '10px' }, children: "Countries" }), _jsx("div", { style: { display: 'flex', flexDirection: 'column', gap: '40px', marginTop: '20px' }, children: DESTINATIONS.filter(d => d.type === 'country').map(dest => (_jsx(UniversalDestinationTemplate, { name: dest.name, type: dest.type, description: dest.description, intelligence: {
                        hurricaneWarning: dest.id === 'brazil' ? 'Seasonal storms expected in coastal regions.' : undefined,
                        culturalWarning: dest.id === 'japan' ? 'High context culture. Silence is communication.' : undefined
                    } }, dest.id))) }), _jsx("h2", { style: { marginTop: '50px', borderBottom: '1px solid var(--lg-stroke)', paddingBottom: '10px' }, children: "Cities" }), _jsx("div", { style: { display: 'flex', flexDirection: 'column', gap: '40px', marginTop: '20px' }, children: DESTINATIONS.filter(d => d.type === 'city').map(dest => (_jsx(UniversalDestinationTemplate, { name: dest.name, type: dest.type, description: dest.description, intelligence: {
                        hurricaneWarning: dest.id === 'tampa-bay' ? 'Hurricane Watch: Category 1 projected path.' : undefined,
                        culturalWarning: dest.id === 'dubai' ? 'Respect local dress codes in public spaces.' : undefined
                    } }, dest.id))) })] }));
};
