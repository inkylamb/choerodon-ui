export function T() {
    return true;
}
// Fix IE file.status problem
// via coping a new Object
export function fileToObject(file) {
    return {
        lastModified: file.lastModified,
        lastModifiedDate: file.lastModifiedDate,
        name: file.filename || file.name,
        size: file.size,
        type: file.type,
        uid: file.uid,
        response: file.response,
        error: file.error,
        percent: 0,
        originFileObj: file,
    };
}
/**
 * 生成Progress percent: 0.1 -> 0.98
 *   - for ie
 */
export function genPercentAdd() {
    let k = 0.1;
    const i = 0.01;
    const end = 0.98;
    return function (s) {
        let start = s;
        if (start >= end) {
            return start;
        }
        start += k;
        k -= i;
        if (k < 0.001) {
            k = 0.001;
        }
        return start * 100;
    };
}
export function getFileItem(file, fileList) {
    const matchKey = file.uid !== undefined ? 'uid' : 'name';
    return fileList.filter(item => item[matchKey] === file[matchKey])[0];
}
export function removeFileItem(file, fileList) {
    const matchKey = file.uid !== undefined ? 'uid' : 'name';
    const removed = fileList.filter(item => item[matchKey] !== file[matchKey]);
    if (removed.length === fileList.length) {
        return null;
    }
    return removed;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJmaWxlIjoiL1VzZXJzL2h1aWh1YXdrL0RvY3VtZW50cy9vcHQvY2hvZXJvZG9uLXVpL2NvbXBvbmVudHMvdXBsb2FkL3V0aWxzLnRzeCIsIm1hcHBpbmdzIjoiQUFFQSxNQUFNLFVBQVUsQ0FBQztJQUNmLE9BQU8sSUFBSSxDQUFDO0FBQ2QsQ0FBQztBQUVELDZCQUE2QjtBQUM3QiwwQkFBMEI7QUFDMUIsTUFBTSxVQUFVLFlBQVksQ0FBQyxJQUFnQjtJQUMzQyxPQUFPO1FBQ0wsWUFBWSxFQUFFLElBQUksQ0FBQyxZQUFZO1FBQy9CLGdCQUFnQixFQUFFLElBQUksQ0FBQyxnQkFBZ0I7UUFDdkMsSUFBSSxFQUFFLElBQUksQ0FBQyxRQUFRLElBQUksSUFBSSxDQUFDLElBQUk7UUFDaEMsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJO1FBQ2YsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJO1FBQ2YsR0FBRyxFQUFFLElBQUksQ0FBQyxHQUFHO1FBQ2IsUUFBUSxFQUFFLElBQUksQ0FBQyxRQUFRO1FBQ3ZCLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSztRQUNqQixPQUFPLEVBQUUsQ0FBQztRQUNWLGFBQWEsRUFBRSxJQUEyQjtLQUM3QixDQUFDO0FBQ2xCLENBQUM7QUFFRDs7O0dBR0c7QUFDSCxNQUFNLFVBQVUsYUFBYTtJQUMzQixJQUFJLENBQUMsR0FBRyxHQUFHLENBQUM7SUFDWixNQUFNLENBQUMsR0FBRyxJQUFJLENBQUM7SUFDZixNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUM7SUFDakIsT0FBTyxVQUFTLENBQVM7UUFDdkIsSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDO1FBQ2QsSUFBSSxLQUFLLElBQUksR0FBRyxFQUFFO1lBQ2hCLE9BQU8sS0FBSyxDQUFDO1NBQ2Q7UUFFRCxLQUFLLElBQUksQ0FBQyxDQUFDO1FBQ1gsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNQLElBQUksQ0FBQyxHQUFHLEtBQUssRUFBRTtZQUNiLENBQUMsR0FBRyxLQUFLLENBQUM7U0FDWDtRQUNELE9BQU8sS0FBSyxHQUFHLEdBQUcsQ0FBQztJQUNyQixDQUFDLENBQUM7QUFDSixDQUFDO0FBRUQsTUFBTSxVQUFVLFdBQVcsQ0FBQyxJQUFnQixFQUFFLFFBQXNCO0lBQ2xFLE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxHQUFHLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQztJQUN6RCxPQUFPLFFBQVEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDdkUsQ0FBQztBQUVELE1BQU0sVUFBVSxjQUFjLENBQUMsSUFBZ0IsRUFBRSxRQUFzQjtJQUNyRSxNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsR0FBRyxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUM7SUFDekQsTUFBTSxPQUFPLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztJQUMzRSxJQUFJLE9BQU8sQ0FBQyxNQUFNLEtBQUssUUFBUSxDQUFDLE1BQU0sRUFBRTtRQUN0QyxPQUFPLElBQUksQ0FBQztLQUNiO0lBQ0QsT0FBTyxPQUFPLENBQUM7QUFDakIsQ0FBQyIsIm5hbWVzIjpbXSwic291cmNlcyI6WyIvVXNlcnMvaHVpaHVhd2svRG9jdW1lbnRzL29wdC9jaG9lcm9kb24tdWkvY29tcG9uZW50cy91cGxvYWQvdXRpbHMudHN4Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFVwbG9hZEZpbGUgfSBmcm9tICcuL2ludGVyZmFjZSc7XG5cbmV4cG9ydCBmdW5jdGlvbiBUKCkge1xuICByZXR1cm4gdHJ1ZTtcbn1cblxuLy8gRml4IElFIGZpbGUuc3RhdHVzIHByb2JsZW1cbi8vIHZpYSBjb3BpbmcgYSBuZXcgT2JqZWN0XG5leHBvcnQgZnVuY3Rpb24gZmlsZVRvT2JqZWN0KGZpbGU6IFVwbG9hZEZpbGUpIHtcbiAgcmV0dXJuIHtcbiAgICBsYXN0TW9kaWZpZWQ6IGZpbGUubGFzdE1vZGlmaWVkLFxuICAgIGxhc3RNb2RpZmllZERhdGU6IGZpbGUubGFzdE1vZGlmaWVkRGF0ZSxcbiAgICBuYW1lOiBmaWxlLmZpbGVuYW1lIHx8IGZpbGUubmFtZSxcbiAgICBzaXplOiBmaWxlLnNpemUsXG4gICAgdHlwZTogZmlsZS50eXBlLFxuICAgIHVpZDogZmlsZS51aWQsXG4gICAgcmVzcG9uc2U6IGZpbGUucmVzcG9uc2UsXG4gICAgZXJyb3I6IGZpbGUuZXJyb3IsXG4gICAgcGVyY2VudDogMCxcbiAgICBvcmlnaW5GaWxlT2JqOiBmaWxlIGFzIChGaWxlIHwgVXBsb2FkRmlsZSksXG4gIH0gYXMgVXBsb2FkRmlsZTtcbn1cblxuLyoqXG4gKiDnlJ/miJBQcm9ncmVzcyBwZXJjZW50OiAwLjEgLT4gMC45OFxuICogICAtIGZvciBpZVxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2VuUGVyY2VudEFkZCgpIHtcbiAgbGV0IGsgPSAwLjE7XG4gIGNvbnN0IGkgPSAwLjAxO1xuICBjb25zdCBlbmQgPSAwLjk4O1xuICByZXR1cm4gZnVuY3Rpb24oczogbnVtYmVyKSB7XG4gICAgbGV0IHN0YXJ0ID0gcztcbiAgICBpZiAoc3RhcnQgPj0gZW5kKSB7XG4gICAgICByZXR1cm4gc3RhcnQ7XG4gICAgfVxuXG4gICAgc3RhcnQgKz0gaztcbiAgICBrIC09IGk7XG4gICAgaWYgKGsgPCAwLjAwMSkge1xuICAgICAgayA9IDAuMDAxO1xuICAgIH1cbiAgICByZXR1cm4gc3RhcnQgKiAxMDA7XG4gIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRGaWxlSXRlbShmaWxlOiBVcGxvYWRGaWxlLCBmaWxlTGlzdDogVXBsb2FkRmlsZVtdKSB7XG4gIGNvbnN0IG1hdGNoS2V5ID0gZmlsZS51aWQgIT09IHVuZGVmaW5lZCA/ICd1aWQnIDogJ25hbWUnO1xuICByZXR1cm4gZmlsZUxpc3QuZmlsdGVyKGl0ZW0gPT4gaXRlbVttYXRjaEtleV0gPT09IGZpbGVbbWF0Y2hLZXldKVswXTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlbW92ZUZpbGVJdGVtKGZpbGU6IFVwbG9hZEZpbGUsIGZpbGVMaXN0OiBVcGxvYWRGaWxlW10pIHtcbiAgY29uc3QgbWF0Y2hLZXkgPSBmaWxlLnVpZCAhPT0gdW5kZWZpbmVkID8gJ3VpZCcgOiAnbmFtZSc7XG4gIGNvbnN0IHJlbW92ZWQgPSBmaWxlTGlzdC5maWx0ZXIoaXRlbSA9PiBpdGVtW21hdGNoS2V5XSAhPT0gZmlsZVttYXRjaEtleV0pO1xuICBpZiAocmVtb3ZlZC5sZW5ndGggPT09IGZpbGVMaXN0Lmxlbmd0aCkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG4gIHJldHVybiByZW1vdmVkO1xufVxuIl0sInZlcnNpb24iOjN9