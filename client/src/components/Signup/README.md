### Оптимизация поля login.Вывод об ошибке при введении пользователем существующего логина

[`Решение 1`]: сброс через useEffect + таймер
[`В компоененте Signup.jsx`]

const prevErrorRef = useRef("");
useEffect(() => {
// сохраняем предыдущее значение errorMessage, которое хранится в ref (prevErrorRef.current).
// Это значение было запомнено при предыдущем вызове useEffect
const prevError = prevErrorRef.current; // null

// обновляем ref новым значением errorMessage, чтобы оно стало "предыдущим" на следующий вызов useEffect.
prevErrorRef.current = errorMessage;
// условие "не выполнять сброс", если:
// errorMessage === prevError — т.е. ошибка не изменилась с прошлого раза
if (!errorMessage || errorMessage === prevError) return;
const timer = setTimeout(() => {
Cбрасываем форму:
dispatch({ type: SET_REGISTER_ERROR, payload: "" }); // очищаем ошибку
// если все поля заполнены. Во избежание принудительного сбрасывания поля преждевременно
if (inputs.login || inputs.password || inputs.name) {
inputsUsersHandler({ target: { name: "reset_all", reset: true } });
}
}, 2000);
return () => clearTimeout(timer); // чистим таймер

}, [errorMessage]);

[`Далее вносим изменения в функцию inputsUsersHandler в компоненте App.jsx`]

[`В компоененте App.jsx`]
const inputsUsersHandler = useCallback((e) => {
if (e.target.name === "reset_all" && e.target.reset) {
setInputs({}); // или начальное состояние формы
return;
}
setInputs((prevInputs) => ({
...prevInputs,
[e.target.name]: e.target.value,
}));
// setInputs не нужно указывать в зависимостях: React гарантирует её стабильность
}, []);

[`В компоененте Signup.jsx`]
<Collapse in={Boolean(errorMessage)}>
<Alert severity="error" sx={{ mb: 2 }}>
{errorMessage}
</Alert>
</Collapse>
