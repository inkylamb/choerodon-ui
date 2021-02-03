import isString from 'lodash/isString';
import ValidationResult from '../ValidationResult';
import { $l } from '../../locale-context';
export default async function customError(value, props) {
    const { customValidator, name, record, form } = props;
    if (typeof customValidator === 'function') {
        const result = await customValidator(value, name, record || form);
        if (isString(result) || result === false) {
            return new ValidationResult({
                validationMessage: result || $l('Validator', 'unknown'),
                value,
                ruleName: 'customError',
            });
        }
    }
    return true;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJmaWxlIjoiL1VzZXJzL2h1aWh1YXdrL0RvY3VtZW50cy9vcHQvY2hvZXJvZG9uLXVpL2NvbXBvbmVudHMtcHJvL3ZhbGlkYXRvci9ydWxlcy9jdXN0b21FcnJvci50c3giLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxRQUFRLE1BQU0saUJBQWlCLENBQUM7QUFDdkMsT0FBTyxnQkFBZ0IsTUFBTSxxQkFBcUIsQ0FBQztBQUNuRCxPQUFPLEVBQUUsRUFBRSxFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFHMUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxLQUFLLFVBQVUsV0FBVyxDQUN2QyxLQUFVLEVBQ1YsS0FBcUI7SUFFckIsTUFBTSxFQUFFLGVBQWUsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxHQUFHLEtBQUssQ0FBQztJQUN0RCxJQUFJLE9BQU8sZUFBZSxLQUFLLFVBQVUsRUFBRTtRQUN6QyxNQUFNLE1BQU0sR0FBRyxNQUFNLGVBQWUsQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLE1BQU0sSUFBSSxJQUFJLENBQUMsQ0FBQztRQUNsRSxJQUFJLFFBQVEsQ0FBQyxNQUFNLENBQUMsSUFBSSxNQUFNLEtBQUssS0FBSyxFQUFFO1lBQ3hDLE9BQU8sSUFBSSxnQkFBZ0IsQ0FBQztnQkFDMUIsaUJBQWlCLEVBQUUsTUFBTSxJQUFJLEVBQUUsQ0FBQyxXQUFXLEVBQUUsU0FBUyxDQUFDO2dCQUN2RCxLQUFLO2dCQUNMLFFBQVEsRUFBRSxhQUFhO2FBQ3hCLENBQUMsQ0FBQztTQUNKO0tBQ0Y7SUFDRCxPQUFPLElBQUksQ0FBQztBQUNkLENBQUMiLCJuYW1lcyI6W10sInNvdXJjZXMiOlsiL1VzZXJzL2h1aWh1YXdrL0RvY3VtZW50cy9vcHQvY2hvZXJvZG9uLXVpL2NvbXBvbmVudHMtcHJvL3ZhbGlkYXRvci9ydWxlcy9jdXN0b21FcnJvci50c3giXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGlzU3RyaW5nIGZyb20gJ2xvZGFzaC9pc1N0cmluZyc7XG5pbXBvcnQgVmFsaWRhdGlvblJlc3VsdCBmcm9tICcuLi9WYWxpZGF0aW9uUmVzdWx0JztcbmltcG9ydCB7ICRsIH0gZnJvbSAnLi4vLi4vbG9jYWxlLWNvbnRleHQnO1xuaW1wb3J0IHsgbWV0aG9kUmV0dXJuLCBWYWxpZGF0b3JQcm9wcyB9IGZyb20gJy4nO1xuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBjdXN0b21FcnJvcihcbiAgdmFsdWU6IGFueSxcbiAgcHJvcHM6IFZhbGlkYXRvclByb3BzLFxuKTogUHJvbWlzZTxtZXRob2RSZXR1cm4+IHtcbiAgY29uc3QgeyBjdXN0b21WYWxpZGF0b3IsIG5hbWUsIHJlY29yZCwgZm9ybSB9ID0gcHJvcHM7XG4gIGlmICh0eXBlb2YgY3VzdG9tVmFsaWRhdG9yID09PSAnZnVuY3Rpb24nKSB7XG4gICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgY3VzdG9tVmFsaWRhdG9yKHZhbHVlLCBuYW1lLCByZWNvcmQgfHwgZm9ybSk7XG4gICAgaWYgKGlzU3RyaW5nKHJlc3VsdCkgfHwgcmVzdWx0ID09PSBmYWxzZSkge1xuICAgICAgcmV0dXJuIG5ldyBWYWxpZGF0aW9uUmVzdWx0KHtcbiAgICAgICAgdmFsaWRhdGlvbk1lc3NhZ2U6IHJlc3VsdCB8fCAkbCgnVmFsaWRhdG9yJywgJ3Vua25vd24nKSxcbiAgICAgICAgdmFsdWUsXG4gICAgICAgIHJ1bGVOYW1lOiAnY3VzdG9tRXJyb3InLFxuICAgICAgfSk7XG4gICAgfVxuICB9XG4gIHJldHVybiB0cnVlO1xufVxuIl0sInZlcnNpb24iOjN9