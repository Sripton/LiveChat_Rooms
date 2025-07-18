### Commits on Jul 17, 2025

[`Анимация сообщений "моргает" (перезапускается/дергается), когда навожу мышь на названия комнат. Компонент перерендеривается. Причина в следующем:`]
[`Когда навожу на комнату, вызывается handleMouseEnter, и это обновляет состояние tooltip:`]

setToolTip({
visible: true,
text,
x: rect.left + rect.width / 2,
y: rect.top - 10,
});

[`React при любом обновлении состояния запускает перерендер компонента Chatrooms, а это:`]
Перезапускает эффект useEffect, который зависит от visibleMessages.length
И хотя visibleMessages не сбрасывается, сам компонент, включая Fade, может повторно отрисоваться или дернуться, особенно если внутри Fade/Paper нет устойчивого ключа или используется key={index} (что не всегда стабильно)

[`Как исправить`]
Не менять tooltip (через setToolTip) если значения не изменились — это предотвратит лишний перерендер:

const handleMouseEnter = (e, text) => {
const rect = e.currentTarget.getBoundingClientRect();
clearTimeout(hideTimeOutRef.current);

showTimeoutRef.current = setTimeout(() => {
const newX = rect.left + rect.width / 2;
const newY = rect.top - 10;

    //  Только если данные изменились — обновляем стейт
    if (
      tooltip.text !== text ||
      tooltip.x !== newX ||
      tooltip.y !== newY ||
      !tooltip.visible
    ) {
      setToolTip({
        visible: true,
        text,
        x: newX,
        y: newY,
      });
      setShowTooltip(true);
    }

}, 400);
};
