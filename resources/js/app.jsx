import "./bootstrap";
import "../css/app.css";

import React from "react";
import { createRoot } from "react-dom/client";
import { createInertiaApp } from "@inertiajs/react";
import Toast from "./Components/Toast";

createInertiaApp({
    resolve: (name) => {
        const pages = import.meta.glob("./Pages/**/*.jsx", { eager: true });
        const page = pages[`./Pages/${name}.jsx`];
        
        // Wrap page with Toast
        page.default.layout = page.default.layout || ((page) => (
            <>
                {page}
                <Toast />
            </>
        ));
        
        return page;
    },
    setup({ el, App, props }) {
        createRoot(el).render(<App {...props} />);
    },
});
