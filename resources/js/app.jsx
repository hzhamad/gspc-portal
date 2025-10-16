import "./bootstrap";
import "../css/app.css";

import React from "react";
import { createRoot } from "react-dom/client";
import { createInertiaApp } from "@inertiajs/react";
import Toast from "./Components/Toast";
import FormLoader from './Components/FormLoader';

createInertiaApp({
    resolve: (name) => {
        const pages = import.meta.glob("./Pages/**/*.jsx", { eager: true });
        const page = pages[`./Pages/${name}.jsx`];
        page.default.layout = page.default.layout || ((page) => (
            <>
                {page}
                <Toast />
                <FormLoader />
            </>
        ));
        
        return page;
    },
    setup({ el, App, props }) {
        createRoot(el).render(<App {...props} />);
    },
});
