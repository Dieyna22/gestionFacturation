import { inject } from "@angular/core";
import { Router } from "@angular/router";


export const UsersGuard = () => {
    const router = inject(Router);
    const auth = JSON.parse(localStorage.getItem("isUsers") || "");
    if (!auth) {
        router.navigateByUrl('/accueil')
        return false;
    }

    return true;
}