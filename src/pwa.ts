import { registerSW } from 'virtual:pwa-register';

registerSW({
  immediate: true,
  onNeedRefresh() {
    console.log('Доступна нова версія FinMentor');
  },
  onOfflineReady() {
    console.log('FinMentor готовий до автономної роботи офлайн');
  }
});