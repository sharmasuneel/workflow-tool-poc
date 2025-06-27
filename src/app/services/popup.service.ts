import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

// popup.service.ts
@Injectable({ providedIn: 'root' })
export class PopupService {
    private popupState = new BehaviorSubject<{ title: string; message: string } | null>(null);
    popupState$ = this.popupState.asObservable();

    open(props: any) {
        this.popupState.next(props);
    }

    close() {
        this.popupState.next(null);
    }
}
