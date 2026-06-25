import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  useEffect(() => {
    const origin = "https://staket.lovable.app";
    const url = `${origin}${location.pathname}`;
    const prevTitle = document.title;
    document.title = "Sidan hittades inte (404) — Stäket Företagscenter";

    const setMeta = (selector: string, attr: string, value: string) => {
      const el = document.head.querySelector<HTMLMetaElement>(selector);
      const prev = el?.getAttribute(attr) ?? null;
      if (el) el.setAttribute(attr, value);
      return { el, prev };
    };
    const setLink = (rel: string, href: string) => {
      let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
      const prev = el?.href ?? null;
      if (!el) {
        el = document.createElement("link");
        el.rel = rel;
        document.head.appendChild(el);
      }
      el.href = href;
      return { el, prev };
    };

    const desc = "Sidan du sökte finns inte. Återvänd till startsidan för Stäket Företagscenter i Järfälla.";
    const restorers: Array<() => void> = [];
    const m1 = setMeta('meta[name="description"]', "content", desc);
    restorers.push(() => m1.el && m1.prev !== null && m1.el.setAttribute("content", m1.prev));
    const m2 = setMeta('meta[property="og:title"]', "content", "Sidan hittades inte — Stäket Företagscenter");
    restorers.push(() => m2.el && m2.prev !== null && m2.el.setAttribute("content", m2.prev));
    const m3 = setMeta('meta[property="og:description"]', "content", desc);
    restorers.push(() => m3.el && m3.prev !== null && m3.el.setAttribute("content", m3.prev));
    const m4 = setMeta('meta[property="og:url"]', "content", url);
    restorers.push(() => m4.el && m4.prev !== null && m4.el.setAttribute("content", m4.prev));
    const m5 = setMeta('meta[name="twitter:title"]', "content", "Sidan hittades inte — Stäket Företagscenter");
    restorers.push(() => m5.el && m5.prev !== null && m5.el.setAttribute("content", m5.prev));
    const m6 = setMeta('meta[name="twitter:description"]', "content", desc);
    restorers.push(() => m6.el && m6.prev !== null && m6.el.setAttribute("content", m6.prev));
    const m7 = setMeta('meta[name="twitter:url"]', "content", url);
    restorers.push(() => m7.el && m7.prev !== null && m7.el.setAttribute("content", m7.prev));
    const m8 = setMeta('meta[name="robots"]', "content", "noindex");
    if (!m8.el) {
      const el = document.createElement("meta");
      el.name = "robots";
      el.content = "noindex";
      document.head.appendChild(el);
      restorers.push(() => el.remove());
    } else {
      restorers.push(() => m8.prev !== null ? m8.el!.setAttribute("content", m8.prev) : m8.el!.removeAttribute("content"));
    }
    const c = setLink("canonical", url);
    restorers.push(() => c.el && c.prev !== null && (c.el.href = c.prev));

    return () => {
      document.title = prevTitle;
      restorers.forEach((r) => r());
    };
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">404</h1>
        <p className="mb-4 text-xl text-muted-foreground">Oops! Page not found</p>
        <a href="/" className="text-primary underline hover:text-primary/90">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
