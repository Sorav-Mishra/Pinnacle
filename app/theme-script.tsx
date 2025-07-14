export function ThemeScript() {
  const script = `
      (function () {
        try {
          const theme = localStorage.getItem('theme');
          if (theme === 'dark') {
            document.documentElement.classList.add('dark');
          } else if (theme === 'light') {
            document.documentElement.classList.remove('dark');
          } else {
            // System preference fallback
            if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
              document.documentElement.classList.add('dark');
            }
          }
        } catch (e) {}
      })();
    `;

  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
