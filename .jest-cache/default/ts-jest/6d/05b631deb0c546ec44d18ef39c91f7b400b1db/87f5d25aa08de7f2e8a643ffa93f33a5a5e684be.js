import { __decorate } from "tslib";
import { action, get, observable, runInAction } from 'mobx';
import moment from 'moment';
import defaultLocale from './locale';
import defaultSupports from './supports';
import normalizeLanguage from '../_util/normalizeLanguage';
function setMomentLocale(locale) {
    moment.locale(normalizeLanguage(locale ? locale.lang : defaultLocale.lang));
}
export class LocaleContext {
    constructor() {
        runInAction(() => {
            this.locale = defaultLocale;
            this.supports = defaultSupports;
        });
    }
    setLocale(locale) {
        setMomentLocale(locale);
        this.locale = locale;
    }
    setSupports(supports) {
        this.supports = supports;
    }
    get(component, key) {
        const cmp = get(this.locale, component);
        return (cmp && get(cmp, key)) || `${component}.${key}`;
    }
}
__decorate([
    observable
], LocaleContext.prototype, "locale", void 0);
__decorate([
    observable
], LocaleContext.prototype, "supports", void 0);
__decorate([
    action
], LocaleContext.prototype, "setLocale", null);
export default new LocaleContext();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJmaWxlIjoiL1VzZXJzL2h1aWh1YXdrL0RvY3VtZW50cy9vcHQvY2hvZXJvZG9uLXVpL2NvbXBvbmVudHMtcHJvL2xvY2FsZS1jb250ZXh0L0xvY2FsZUNvbnRleHQudHN4IiwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBRSxVQUFVLEVBQUUsV0FBVyxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQzVELE9BQU8sTUFBTSxNQUFNLFFBQVEsQ0FBQztBQUM1QixPQUFPLGFBQXlCLE1BQU0sVUFBVSxDQUFDO0FBQ2pELE9BQU8sZUFBNkIsTUFBTSxZQUFZLENBQUM7QUFDdkQsT0FBTyxpQkFBaUIsTUFBTSw0QkFBNEIsQ0FBQztBQUUzRCxTQUFTLGVBQWUsQ0FBQyxNQUFjO0lBQ3JDLE1BQU0sQ0FBQyxNQUFNLENBQUMsaUJBQWlCLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztBQUM5RSxDQUFDO0FBRUQsTUFBTSxPQUFPLGFBQWE7SUFLeEI7UUFDRSxXQUFXLENBQUMsR0FBRyxFQUFFO1lBQ2YsSUFBSSxDQUFDLE1BQU0sR0FBRyxhQUFhLENBQUM7WUFDNUIsSUFBSSxDQUFDLFFBQVEsR0FBRyxlQUFlLENBQUM7UUFDbEMsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBR0QsU0FBUyxDQUFDLE1BQWM7UUFDdEIsZUFBZSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3hCLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO0lBQ3ZCLENBQUM7SUFFRCxXQUFXLENBQUMsUUFBa0I7UUFDNUIsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7SUFDM0IsQ0FBQztJQUVELEdBQUcsQ0FBQyxTQUFpQixFQUFFLEdBQVc7UUFDaEMsTUFBTSxHQUFHLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFDeEMsT0FBTyxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDLElBQUksR0FBRyxTQUFTLElBQUksR0FBRyxFQUFFLENBQUM7SUFDekQsQ0FBQztDQUNGO0FBekJhO0lBQVgsVUFBVTs2Q0FBZ0I7QUFFZjtJQUFYLFVBQVU7K0NBQW9CO0FBVS9CO0lBREMsTUFBTTs4Q0FJTjtBQVlILGVBQWUsSUFBSSxhQUFhLEVBQUUsQ0FBQyIsIm5hbWVzIjpbXSwic291cmNlcyI6WyIvVXNlcnMvaHVpaHVhd2svRG9jdW1lbnRzL29wdC9jaG9lcm9kb24tdWkvY29tcG9uZW50cy1wcm8vbG9jYWxlLWNvbnRleHQvTG9jYWxlQ29udGV4dC50c3giXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgYWN0aW9uLCBnZXQsIG9ic2VydmFibGUsIHJ1bkluQWN0aW9uIH0gZnJvbSAnbW9ieCc7XG5pbXBvcnQgbW9tZW50IGZyb20gJ21vbWVudCc7XG5pbXBvcnQgZGVmYXVsdExvY2FsZSwgeyBMb2NhbGUgfSBmcm9tICcuL2xvY2FsZSc7XG5pbXBvcnQgZGVmYXVsdFN1cHBvcnRzLCB7IFN1cHBvcnRzIH0gZnJvbSAnLi9zdXBwb3J0cyc7XG5pbXBvcnQgbm9ybWFsaXplTGFuZ3VhZ2UgZnJvbSAnLi4vX3V0aWwvbm9ybWFsaXplTGFuZ3VhZ2UnO1xuXG5mdW5jdGlvbiBzZXRNb21lbnRMb2NhbGUobG9jYWxlOiBMb2NhbGUpIHtcbiAgbW9tZW50LmxvY2FsZShub3JtYWxpemVMYW5ndWFnZShsb2NhbGUgPyBsb2NhbGUubGFuZyA6IGRlZmF1bHRMb2NhbGUubGFuZykpO1xufVxuXG5leHBvcnQgY2xhc3MgTG9jYWxlQ29udGV4dCB7XG4gIEBvYnNlcnZhYmxlIGxvY2FsZTogTG9jYWxlO1xuXG4gIEBvYnNlcnZhYmxlIHN1cHBvcnRzOiBTdXBwb3J0cztcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBydW5JbkFjdGlvbigoKSA9PiB7XG4gICAgICB0aGlzLmxvY2FsZSA9IGRlZmF1bHRMb2NhbGU7XG4gICAgICB0aGlzLnN1cHBvcnRzID0gZGVmYXVsdFN1cHBvcnRzO1xuICAgIH0pO1xuICB9XG5cbiAgQGFjdGlvblxuICBzZXRMb2NhbGUobG9jYWxlOiBMb2NhbGUpIHtcbiAgICBzZXRNb21lbnRMb2NhbGUobG9jYWxlKTtcbiAgICB0aGlzLmxvY2FsZSA9IGxvY2FsZTtcbiAgfVxuXG4gIHNldFN1cHBvcnRzKHN1cHBvcnRzOiBTdXBwb3J0cykge1xuICAgIHRoaXMuc3VwcG9ydHMgPSBzdXBwb3J0cztcbiAgfVxuXG4gIGdldChjb21wb25lbnQ6IHN0cmluZywga2V5OiBzdHJpbmcpIHtcbiAgICBjb25zdCBjbXAgPSBnZXQodGhpcy5sb2NhbGUsIGNvbXBvbmVudCk7XG4gICAgcmV0dXJuIChjbXAgJiYgZ2V0KGNtcCwga2V5KSkgfHwgYCR7Y29tcG9uZW50fS4ke2tleX1gO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IG5ldyBMb2NhbGVDb250ZXh0KCk7XG4iXSwidmVyc2lvbiI6M30=