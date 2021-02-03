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
const isImageFileType = (type) => type.indexOf('image/') === 0;
const MEASURE_SIZE = 200;
export function previewImage(file) {
    return new Promise(resolve => {
        if (!file.type || !isImageFileType(file.type)) {
            resolve('');
            return;
        }
        const canvas = document.createElement('canvas');
        canvas.width = MEASURE_SIZE;
        canvas.height = MEASURE_SIZE;
        canvas.style.cssText = `position: fixed; left: 0; top: 0; width: ${MEASURE_SIZE}px; height: ${MEASURE_SIZE}px; z-index: 9999; display: none;`;
        document.body.appendChild(canvas);
        const ctx = canvas.getContext('2d');
        const img = new Image();
        img.onload = () => {
            const { width, height } = img;
            let drawWidth = MEASURE_SIZE;
            let drawHeight = MEASURE_SIZE;
            let offsetX = 0;
            let offsetY = 0;
            if (width < height) {
                drawHeight = height * (MEASURE_SIZE / width);
                offsetY = -(drawHeight - drawWidth) / 2;
            }
            else {
                drawWidth = width * (MEASURE_SIZE / height);
                offsetX = -(drawWidth - drawHeight) / 2;
            }
            ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
            const dataURL = canvas.toDataURL();
            document.body.removeChild(canvas);
            resolve(dataURL);
        };
        img.src = window.URL.createObjectURL(file);
    });
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJmaWxlIjoiL1VzZXJzL2h1aWh1YXdrL0RvY3VtZW50cy9vcHQvY2hvZXJvZG9uLXVpL2NvbXBvbmVudHMvdXBsb2FkL3V0aWxzLnRzeCIsIm1hcHBpbmdzIjoiQUFFQSxNQUFNLFVBQVUsQ0FBQztJQUNmLE9BQU8sSUFBSSxDQUFDO0FBQ2QsQ0FBQztBQUVELDZCQUE2QjtBQUM3QiwwQkFBMEI7QUFDMUIsTUFBTSxVQUFVLFlBQVksQ0FBQyxJQUFnQjtJQUMzQyxPQUFPO1FBQ0wsWUFBWSxFQUFFLElBQUksQ0FBQyxZQUFZO1FBQy9CLGdCQUFnQixFQUFFLElBQUksQ0FBQyxnQkFBZ0I7UUFDdkMsSUFBSSxFQUFFLElBQUksQ0FBQyxRQUFRLElBQUksSUFBSSxDQUFDLElBQUk7UUFDaEMsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJO1FBQ2YsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJO1FBQ2YsR0FBRyxFQUFFLElBQUksQ0FBQyxHQUFHO1FBQ2IsUUFBUSxFQUFFLElBQUksQ0FBQyxRQUFRO1FBQ3ZCLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSztRQUNqQixPQUFPLEVBQUUsQ0FBQztRQUNWLGFBQWEsRUFBRSxJQUEyQjtLQUM3QixDQUFDO0FBQ2xCLENBQUM7QUFFRDs7O0dBR0c7QUFDSCxNQUFNLFVBQVUsYUFBYTtJQUMzQixJQUFJLENBQUMsR0FBRyxHQUFHLENBQUM7SUFDWixNQUFNLENBQUMsR0FBRyxJQUFJLENBQUM7SUFDZixNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUM7SUFDakIsT0FBTyxVQUFTLENBQVM7UUFDdkIsSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDO1FBQ2QsSUFBSSxLQUFLLElBQUksR0FBRyxFQUFFO1lBQ2hCLE9BQU8sS0FBSyxDQUFDO1NBQ2Q7UUFFRCxLQUFLLElBQUksQ0FBQyxDQUFDO1FBQ1gsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNQLElBQUksQ0FBQyxHQUFHLEtBQUssRUFBRTtZQUNiLENBQUMsR0FBRyxLQUFLLENBQUM7U0FDWDtRQUNELE9BQU8sS0FBSyxH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QUFHLENBQUMsQ0FBQzthQUN6QztZQUVELEdBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFLFVBQVUsQ0FBQyxDQUFDO1lBQzdELE1BQU0sT0FBTyxHQUFHLE1BQU0sQ0FBQyxTQUFTLEVBQUUsQ0FBQztZQUNuQyxRQUFRLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUVsQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDbkIsQ0FBQyxDQUFDO1FBQ0YsR0FBRyxDQUFDLEdBQUcsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUM3QyxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMiLCJuYW1lcyI6W10sInNvdXJjZXMiOlsiL1VzZXJzL2h1aWh1YXdrL0RvY3VtZW50cy9vcHQvY2hvZXJvZG9uLXVpL2NvbXBvbmVudHMvdXBsb2FkL3V0aWxzLnRzeCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBVcGxvYWRGaWxlIH0gZnJvbSAnLi9pbnRlcmZhY2UnO1xuXG5leHBvcnQgZnVuY3Rpb24gVCgpIHtcbiAgcmV0dXJuIHRydWU7XG59XG5cbi8vIEZpeCBJRSBmaWxlLnN0YXR1cyBwcm9ibGVtXG4vLyB2aWEgY29waW5nIGEgbmV3IE9iamVjdFxuZXhwb3J0IGZ1bmN0aW9uIGZpbGVUb09iamVjdChmaWxlOiBVcGxvYWRGaWxlKSB7XG4gIHJldHVybiB7XG4gICAgbGFzdE1vZGlmaWVkOiBmaWxlLmxhc3RNb2RpZmllZCxcbiAgICBsYXN0TW9kaWZpZWREYXRlOiBmaWxlLmxhc3RNb2RpZmllZERhdGUsXG4gICAgbmFtZTogZmlsZS5maWxlbmFtZSB8fCBmaWxlLm5hbWUsXG4gICAgc2l6ZTogZmlsZS5zaXplLFxuICAgIHR5cGU6IGZpbGUudHlwZSxcbiAgICB1aWQ6IGZpbGUudWlkLFxuICAgIHJlc3BvbnNlOiBmaWxlLnJlc3BvbnNlLFxuICAgIGVycm9yOiBmaWxlLmVycm9yLFxuICAgIHBlcmNlbnQ6IDAsXG4gICAgb3JpZ2luRmlsZU9iajogZmlsZSBhcyAoRmlsZSB8IFVwbG9hZEZpbGUpLFxuICB9IGFzIFVwbG9hZEZpbGU7XG59XG5cbi8qKlxuICog55Sf5oiQUHJvZ3Jlc3MgcGVyY2VudDogMC4xIC0+IDAuOThcbiAqICAgLSBmb3IgaWVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdlblBlcmNlbnRBZGQoKSB7XG4gIGxldCBrID0gMC4xO1xuICBjb25zdCBpID0gMC4wMTtcbiAgY29uc3QgZW5kID0gMC45ODtcbiAgcmV0dXJuIGZ1bmN0aW9uKHM6IG51bWJlcikge1xuICAgIGxldCBzdGFydCA9IHM7XG4gICAgaWYgKHN0YXJ0ID49IGVuZCkge1xuICAgICAgcmV0dXJuIHN0YXJ0O1xuICAgIH1cblxuICAgIHN0YXJ0ICs9IGs7XG4gICAgayAtPSBpO1xuICAgIGlmIChrIDwgMC4wMDEpIHtcbiAgICAgIGsgPSAwLjAwMTtcbiAgICB9XG4gICAgcmV0dXJuIHN0YXJ0ICogMTAwO1xuICB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0RmlsZUl0ZW0oZmlsZTogVXBsb2FkRmlsZSwgZmlsZUxpc3Q6IFVwbG9hZEZpbGVbXSkge1xuICBjb25zdCBtYXRjaEtleSA9IGZpbGUudWlkICE9PSB1bmRlZmluZWQgPyAndWlkJyA6ICduYW1lJztcbiAgcmV0dXJuIGZpbGVMaXN0LmZpbHRlcihpdGVtID0+IGl0ZW1bbWF0Y2hLZXldID09PSBmaWxlW21hdGNoS2V5XSlbMF07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZW1vdmVGaWxlSXRlbShmaWxlOiBVcGxvYWRGaWxlLCBmaWxlTGlzdDogVXBsb2FkRmlsZVtdKSB7XG4gIGNvbnN0IG1hdGNoS2V5ID0gZmlsZS51aWQgIT09IHVuZGVmaW5lZCA/ICd1aWQnIDogJ25hbWUnO1xuICBjb25zdCByZW1vdmVkID0gZmlsZUxpc3QuZmlsdGVyKGl0ZW0gPT4gaXRlbVttYXRjaEtleV0gIT09IGZpbGVbbWF0Y2hLZXldKTtcbiAgaWYgKHJlbW92ZWQubGVuZ3RoID09PSBmaWxlTGlzdC5sZW5ndGgpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICByZXR1cm4gcmVtb3ZlZDtcbn1cblxuY29uc3QgaXNJbWFnZUZpbGVUeXBlID0gKHR5cGU6IHN0cmluZyk6IGJvb2xlYW4gPT4gdHlwZS5pbmRleE9mKCdpbWFnZS8nKSA9PT0gMDtcblxuY29uc3QgTUVBU1VSRV9TSVpFID0gMjAwO1xuZXhwb3J0IGZ1bmN0aW9uIHByZXZpZXdJbWFnZShmaWxlOiBGaWxlIHwgQmxvYik6IFByb21pc2U8c3RyaW5nPiB7XG4gIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICBpZiAoIWZpbGUudHlwZSB8fCAhaXNJbWFnZUZpbGVUeXBlKGZpbGUudHlwZSkpIHtcbiAgICAgIHJlc29sdmUoJycpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xuICAgIGNhbnZhcy53aWR0aCA9IE1FQVNVUkVfU0laRTtcbiAgICBjYW52YXMuaGVpZ2h0ID0gTUVBU1VSRV9TSVpFO1xuICAgIGNhbnZhcy5zdHlsZS5jc3NUZXh0ID0gYHBvc2l0aW9uOiBmaXhlZDsgbGVmdDogMDsgdG9wOiAwOyB3aWR0aDogJHtNRUFTVVJFX1NJWkV9cHg7IGhlaWdodDogJHtNRUFTVVJFX1NJWkV9cHg7IHotaW5kZXg6IDk5OTk7IGRpc3BsYXk6IG5vbmU7YDtcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGNhbnZhcyk7XG4gICAgY29uc3QgY3R4ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG4gICAgY29uc3QgaW1nID0gbmV3IEltYWdlKCk7XG4gICAgaW1nLm9ubG9hZCA9ICgpID0+IHtcbiAgICAgIGNvbnN0IHsgd2lkdGgsIGhlaWdodCB9ID0gaW1nO1xuXG4gICAgICBsZXQgZHJhd1dpZHRoID0gTUVBU1VSRV9TSVpFO1xuICAgICAgbGV0IGRyYXdIZWlnaHQgPSBNRUFTVVJFX1NJWkU7XG4gICAgICBsZXQgb2Zmc2V0WCA9IDA7XG4gICAgICBsZXQgb2Zmc2V0WSA9IDA7XG5cbiAgICAgIGlmICh3aWR0aCA8IGhlaWdodCkge1xuICAgICAgICBkcmF3SGVpZ2h0ID0gaGVpZ2h0ICogKE1FQVNVUkVfU0laRSAvIHdpZHRoKTtcbiAgICAgICAgb2Zmc2V0WSA9IC0oZHJhd0hlaWdodCAtIGRyYXdXaWR0aCkgLyAyO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZHJhd1dpZHRoID0gd2lkdGggKiAoTUVBU1VSRV9TSVpFIC8gaGVpZ2h0KTtcbiAgICAgICAgb2Zmc2V0WCA9IC0oZHJhd1dpZHRoIC0gZHJhd0hlaWdodCkgLyAyO1xuICAgICAgfVxuXG4gICAgICBjdHghLmRyYXdJbWFnZShpbWcsIG9mZnNldFgsIG9mZnNldFksIGRyYXdXaWR0aCwgZHJhd0hlaWdodCk7XG4gICAgICBjb25zdCBkYXRhVVJMID0gY2FudmFzLnRvRGF0YVVSTCgpO1xuICAgICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChjYW52YXMpO1xuXG4gICAgICByZXNvbHZlKGRhdGFVUkwpO1xuICAgIH07XG4gICAgaW1nLnNyYyA9IHdpbmRvdy5VUkwuY3JlYXRlT2JqZWN0VVJMKGZpbGUpO1xuICB9KTtcbn1cblxuIl0sInZlcnNpb24iOjN9