import raf from 'raf';
import getScroll from './getScroll';
import { easeInOutCubic } from './easings';
export default function scrollTo(y, options = {}) {
    const { getContainer = () => window, callback, duration = 450 } = options;
    const container = getContainer();
    const scrollTop = getScroll(container, true);
    const startTime = Date.now();
    const frameFunc = () => {
        const timestamp = Date.now();
        const time = timestamp - startTime;
        const nextScrollTop = easeInOutCubic(time > duration ? duration : time, scrollTop, y, duration);
        if (container === window) {
            window.scrollTo(window.pageXOffset, nextScrollTop);
        }
        else {
            container.scrollTop = nextScrollTop;
        }
        if (time < duration) {
            raf(frameFunc);
        }
        else if (typeof callback === 'function') {
            callback();
        }
    };
    raf(frameFunc);
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJmaWxlIjoiL1VzZXJzL2h1aWh1YXdrL0RvY3VtZW50cy9vcHQvY2hvZXJvZG9uLXVpL2NvbXBvbmVudHMvX3V0aWwvc2Nyb2xsVG8udHN4IiwibWFwcGluZ3MiOiJBQUFBLE9BQU8sR0FBRyxNQUFNLEtBQUssQ0FBQztBQUN0QixPQUFPLFNBQVMsTUFBTSxhQUFhLENBQUM7QUFDcEMsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLFdBQVcsQ0FBQztBQVczQyxNQUFNLENBQUMsT0FBTyxVQUFVLFFBQVEsQ0FBQyxDQUFTLEVBQUUsVUFBMkIsRUFBRTtJQUN2RSxNQUFNLEVBQUUsWUFBWSxHQUFHLEdBQUcsRUFBRSxDQUFDLE1BQU0sRUFBRSxRQUFRLEVBQUUsUUFBUSxHQUFHLEdBQUcsRUFBRSxHQUFHLE9BQU8sQ0FBQztJQUUxRSxNQUFNLFNBQVMsR0FBRyxZQUFZLEVBQUUsQ0FBQztJQUNqQyxNQUFNLFNBQVMsR0FBRyxTQUFTLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQzdDLE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztJQUU3QixNQUFNLFNBQVMsR0FBRyxHQUFHLEVBQUU7UUFDckIsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO1FBQzdCLE1BQU0sSUFBSSxHQUFHLFNBQVMsR0FBRyxTQUFTLENBQUM7UUFDbkMsTUFBTSxhQUFhLEdBQUcsY0FBYyxDQUFDLElBQUksR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLFNBQVMsRUFBRSxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDaEcsSUFBSSxTQUFTLEtBQUssTUFBTSxFQUFFO1lBQ3hCLE1BQU0sQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLFdBQVcsRUFBRSxhQUFhLENBQUMsQ0FBQztTQUNwRDthQUFNO1lBQ0osU0FBeUIsQ0FBQyxTQUFTLEdBQUcsYUFBYSxDQUFDO1NBQ3REO1FBQ0QsSUFBSSxJQUFJLEdBQUcsUUFBUSxFQUFFO1lBQ25CLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQztTQUNoQjthQUFNLElBQUksT0FBTyxRQUFRLEtBQUssVUFBVSxFQUFFO1lBQ3pDLFFBQVEsRUFBRSxDQUFDO1NBQ1o7SUFDSCxDQUFDLENBQUM7SUFDRixHQUFHLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDakIsQ0FBQyIsIm5hbWVzIjpbXSwic291cmNlcyI6WyIvVXNlcnMvaHVpaHVhd2svRG9jdW1lbnRzL29wdC9jaG9lcm9kb24tdWkvY29tcG9uZW50cy9fdXRpbC9zY3JvbGxUby50c3giXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHJhZiBmcm9tICdyYWYnO1xuaW1wb3J0IGdldFNjcm9sbCBmcm9tICcuL2dldFNjcm9sbCc7XG5pbXBvcnQgeyBlYXNlSW5PdXRDdWJpYyB9IGZyb20gJy4vZWFzaW5ncyc7XG5cbmludGVyZmFjZSBTY3JvbGxUb09wdGlvbnMge1xuICAvKiogU2Nyb2xsIGNvbnRhaW5lciwgZGVmYXVsdCBhcyB3aW5kb3cgKi9cbiAgZ2V0Q29udGFpbmVyPzogKCkgPT4gSFRNTEVsZW1lbnQgfCBXaW5kb3c7XG4gIC8qKiBTY3JvbGwgZW5kIGNhbGxiYWNrICovXG4gIGNhbGxiYWNrPzogKCkgPT4gYW55O1xuICAvKiogQW5pbWF0aW9uIGR1cmF0aW9uLCBkZWZhdWx0IGFzIDQ1MCAqL1xuICBkdXJhdGlvbj86IG51bWJlcjtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gc2Nyb2xsVG8oeTogbnVtYmVyLCBvcHRpb25zOiBTY3JvbGxUb09wdGlvbnMgPSB7fSkge1xuICBjb25zdCB7IGdldENvbnRhaW5lciA9ICgpID0+IHdpbmRvdywgY2FsbGJhY2ssIGR1cmF0aW9uID0gNDUwIH0gPSBvcHRpb25zO1xuXG4gIGNvbnN0IGNvbnRhaW5lciA9IGdldENvbnRhaW5lcigpO1xuICBjb25zdCBzY3JvbGxUb3AgPSBnZXRTY3JvbGwoY29udGFpbmVyLCB0cnVlKTtcbiAgY29uc3Qgc3RhcnRUaW1lID0gRGF0ZS5ub3coKTtcblxuICBjb25zdCBmcmFtZUZ1bmMgPSAoKSA9PiB7XG4gICAgY29uc3QgdGltZXN0YW1wID0gRGF0ZS5ub3coKTtcbiAgICBjb25zdCB0aW1lID0gdGltZXN0YW1wIC0gc3RhcnRUaW1lO1xuICAgIGNvbnN0IG5leHRTY3JvbGxUb3AgPSBlYXNlSW5PdXRDdWJpYyh0aW1lID4gZHVyYXRpb24gPyBkdXJhdGlvbiA6IHRpbWUsIHNjcm9sbFRvcCwgeSwgZHVyYXRpb24pO1xuICAgIGlmIChjb250YWluZXIgPT09IHdpbmRvdykge1xuICAgICAgd2luZG93LnNjcm9sbFRvKHdpbmRvdy5wYWdlWE9mZnNldCwgbmV4dFNjcm9sbFRvcCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIChjb250YWluZXIgYXMgSFRNTEVsZW1lbnQpLnNjcm9sbFRvcCA9IG5leHRTY3JvbGxUb3A7XG4gICAgfVxuICAgIGlmICh0aW1lIDwgZHVyYXRpb24pIHtcbiAgICAgIHJhZihmcmFtZUZ1bmMpO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIGNhbGxiYWNrID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBjYWxsYmFjaygpO1xuICAgIH1cbiAgfTtcbiAgcmFmKGZyYW1lRnVuYyk7XG59XG4iXSwidmVyc2lvbiI6M30=