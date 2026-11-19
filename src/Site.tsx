import { lazy, Suspense, useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import {
  ArrowDownRight, ArrowRight, ArrowUpRight, CalendarDays, Check, Heart,
  MapPin, Menu, MoveUpRight, ShieldCheck, Sparkles, Stethoscope, Users, X,
} from 'lucide-react';
const ToothExplorer = lazy(() => import('./components/ToothExplorer'));

const heroPhoto = `${import.meta.env.BASE_URL}images/soins-dentaires.webp`;
const teamPhoto = `${import.meta.env.BASE_URL}images/equipe-dentaire.webp`;

function BrandMark() {
  return (
    <Link className="brand" to="/" aria-label="Cabinet Dentaire Sissoko — accueil">
      <span className="brand-icon" aria-hidden="true">
        <svg viewBox="0 0 40 40" fill="none"><path d="M10 12.7c2.6-3.1 6.2-1.8 10-.1 3.8-1.7 7.4-3 10 .1 3.3 3.9.3 11.7-1.6 17-.9 2.5-2.6 2.5-3.5-.1l-3.1-7.8c-.7-1.7-2.9-1.7-3.6 0l-3.1 7.8c-.9 2.6-2.6 2.6-3.5.1-1.9-5.3-4.9-13.1-1.6-17Z" fill="currentColor"/><path d="M5.8 20.4h3.1m22.2 0h3.1" stroke="#D3AB58" strokeWidth="1.6" strokeLinecap="round"/></svg>
      </span>
      <span className="brand-type"><strong>Cabinet Dentaire</strong><span>SISSOKO <i>·</i> BAMAKO</span></span>
    </Link>
  );
}

function IntroAnimation({ onClose }: { onClose: () => void }) {
  return (
    <div className="opening" role="dialog" aria-modal="true" aria-label="Présentation du Cabinet Dentaire Sissoko">
      <div className="opening-orbit orbit-one" /><div className="opening-orbit orbit-two" />
      <div className="opening-content">
        <div className="opening-mark"><svg viewBox="0 0 40 40" fill="none"><path d="M10 12.7c2.6-3.1 6.2-1.8 10-.1 3.8-1.7 7.4-3 10 .1 3.3 3.9.3 11.7-1.6 17-.9 2.5-2.6 2.5-3.5-.1l-3.1-7.8c-.7-1.7-2.9-1.7-3.6 0l-3.1 7.8c-.9 2.6-2.6 2.6-3.5.1-1.9-5.3-4.9-13.1-1.6-17Z" fill="currentColor"/></svg></div>
        <p className="opening-kicker">BANANKABOUGOU · BAMAKO</p>
        <h2>Le soin commence<br /><span>par l’écoute.</span></h2>
        <div className="opening-rule"><span /></div>
        <button className="opening-enter" onClick={onClose}>Entrer dans le cabinet <ArrowRight size={16} /></button>
      </div>
      <span className="opening-caption">CABINET DENTAIRE SISSOKO <i>—</i> DEPUIS 2021</span>
    </div>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  useEffect(() => setOpen(false), [location.pathname]);
  const links = [
    { to: '/', label: 'Accueil', end: true },
    { to: '/soins', label: 'Nos soins' },
    { to: '/equipe', label: 'L’équipe' },
    { to: '/cabinet', label: 'Le cabinet' },
  ];
  return (
    <header className="site-header">
      <div className="header-inner">
        <BrandMark />
        <button className="menu-toggle" aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'} aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
        <nav className={open ? 'main-nav nav-open' : 'main-nav'} aria-label="Navigation principale">
          {links.map((item) => <NavLink key={item.to} to={item.to} end={item.end} className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>{item.label}</NavLink>)}
          <Link className="header-cta" to="/cabinet">Nous trouver <ArrowUpRight size={16} /></Link>
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div className="footer-brand-column">
          <BrandMark />
          <p>Des soins dentaires de proximité,<br />à Banankabougou, depuis 2021.</p>
        </div>
        <div className="footer-nav-column"><span className="footer-label">Explorer</span><Link to="/soins">Nos soins</Link><Link to="/equipe">Notre équipe</Link><Link to="/cabinet">Le cabinet</Link></div>
        <div className="footer-nav-column"><span className="footer-label">Nous situer</span><span>Banankabougou</span><span>Secteur de Faladié</span><span>Commune VI · Bamako, Mali</span></div>
        <div className="footer-appointment"><span className="footer-label">Une question de soin ?</span><p>Pour un rendez-vous, adressez-vous directement au cabinet.</p><Link to="/cabinet" className="footer-link">Préparer ma visite <ArrowRight size={16} /></Link></div>
      </div>
      <div className="footer-bottom"><span>© Cabinet Dentaire Sissoko · Banankabougou, Bamako</span><span>Soins de proximité, avec attention.</span></div>
    </footer>
  );
}

function SiteLayout() {
  const [showIntro, setShowIntro] = useState(false);
  useEffect(() => {
    try {
      if (sessionStorage.getItem('sissoko-opening-seen')) return;
      sessionStorage.setItem('sissoko-opening-seen', 'true');
    } catch { /* Le site reste accessible sans stockage de session. */ }
    setShowIntro(true);
    const timer = window.setTimeout(() => setShowIntro(false), 2600);
    return () => window.clearTimeout(timer);
  }, []);
  const location = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, [location.pathname]);
  return (
    <>
      {showIntro && <IntroAnimation onClose={() => setShowIntro(false)} />}
      <Header /><main><Outlet /></main><Footer />
    </>
  );
}

export function Reveal({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const [visible, setVisible] = useState(false);
  const [node, setNode] = useState<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!node) return;
    if (!('IntersectionObserver' in window)) { setVisible(true); return; }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); observer.disconnect(); }
    }, { threshold: 0.12, rootMargin: '0px 0px -32px 0px' });
    observer.observe(node);
    return () => observer.disconnect();
  }, [node]);
  return <div ref={setNode} className={`reveal ${visible ? 'is-visible' : ''} ${className}`}>{children}</div>;
}

function Eyebrow({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return <p className={`eyebrow ${light ? 'eyebrow-light' : ''}`}><span />{children}</p>;
}

function PageIntro({ eyebrow, title, copy, icon }: { eyebrow: string; title: React.ReactNode; copy: string; icon: React.ReactNode }) {
  return (
    <section className="page-intro">
      <div className="page-intro-inner"><div><Eyebrow>{eyebrow}</Eyebrow><h1>{title}</h1><p>{copy}</p></div><div className="page-intro-mark" aria-hidden="true">{icon}</div></div>
      <div className="page-intro-location"><MapPin size={14} /> Banankabougou <span>·</span> Bamako, Mali</div>
    </section>
  );
}

const services: { number: string; title: string; desc: string; icon: React.ReactNode; image?: string; imageAlt?: string }[] = [
  { number: '01', title: 'Consultations & soins courants', desc: 'Évaluation bucco-dentaire, diagnostic et soins courants selon vos besoins.', icon: <Stethoscope /> },
  { number: '02', title: 'Extractions & blanchiment', desc: 'Proposés selon l’indication clinique et l’évaluation du praticien.', icon: <Sparkles /> },
  { number: '03', title: 'Prothèses dentaires', desc: 'Des solutions définies selon votre situation et le plan de soins retenu.', icon: <ShieldCheck /> },
  { number: '04', title: 'Orthodontie', desc: 'Un accompagnement après évaluation, selon le plan adapté.', icon: <Heart />, image: `${import.meta.env.BASE_URL}images/orthodontie.webp`, imageAlt: 'Gros plan illustratif d’un traitement orthodontique avec bagues dentaires' },
  { number: '05', title: 'Implant dentaire', desc: 'Une solution envisagée après évaluation clinique et selon le plan de soins adapté.', icon: <ShieldCheck />, image: `${import.meta.env.BASE_URL}images/implant-dentaire.webp`, imageAlt: 'Modèle pédagogique montrant un implant dentaire' },
];

export function HomePage() {
  return (
    <>
      <section className="home-hero">
        <div className="hero-inner">
          <div className="hero-copy">
            <Eyebrow>SOINS DENTAIRES DE PROXIMITÉ <span className="since-tag">DEPUIS 2021</span></Eyebrow>
            <h1>Prendre soin<br />de votre sourire,<br /><em>tout près de vous.</em></h1>
            <p>Un cabinet dentaire de quartier, au cœur de Banankabougou, pour vous accompagner avec attention.</p>
            <div className="hero-actions"><Link to="/soins" className="button button-primary">Découvrir nos soins <ArrowUpRight size={17} /></Link><Link to="/cabinet" className="button button-quiet">Nous trouver <ArrowRight size={17} /></Link></div>
            <div className="hero-local"><MapPin size={16} /><span>Banankabougou <i>·</i> Commune VI, Bamako</span></div>
          </div>
          <div className="hero-visual">
            <img src={heroPhoto} alt="Échange attentif entre une professionnelle dentaire et une patiente" fetchPriority="high" />
            <span className="hero-image-note"><span className="note-dot" /> Une pratique ancrée dans son quartier</span>
          <div className="hero-stamp"><span>AU SERVICE<br />DU QUARTIER</span><strong>2021</strong></div>
        </div>
      </div>
        <div className="hero-foot"><span>UNE PRATIQUE DE PROXIMITÉ</span><span>BANANKABOUGOU · BAMAKO <ArrowDownRight size={14} /></span></div>
      </section>

      <section className="trust-strip" aria-label="En bref"><div className="trust-item"><span className="trust-number">2021</span><span>Notre cabinet<br />depuis</span></div><div className="trust-divider" /><div className="trust-item"><MapPin size={19} /><span>Un ancrage à<br /><strong>Banankabougou</strong></span></div><div className="trust-divider" /><div className="trust-item"><Users size={20} /><span>Une équipe<br /><strong>au service du soin</strong></span></div><div className="trust-divider" /><Link className="trust-more" to="/cabinet">En savoir plus <ArrowUpRight size={16} /></Link></section>

      <section className="section home-services">
        <div className="section-heading"><div><Eyebrow>VOTRE SANTÉ BUCCO-DENTAIRE</Eyebrow><h2>Des soins pensés<br />pour <em>chaque étape.</em></h2></div><p>Chaque prise en charge commence par l’écoute et une évaluation de votre situation.</p></div>
        <div className="services-grid">{services.map((service) => <Reveal key={service.number}><Link to="/soins" className="service-card"><div className="service-card-top"><span className="service-number">{service.number}</span><span className="service-icon">{service.icon}</span></div><h3>{service.title}</h3><p>{service.desc}</p><span className="service-arrow"><ArrowUpRight size={17} /></span></Link></Reveal>)}</div>
        <div className="center-link"><Link className="text-link" to="/soins">Voir l’ensemble des soins <ArrowRight size={17} /></Link></div>
      </section>

      <section className="tooth-section">
        <div className="section tooth-section-inner">
          <div className="tooth-copy"><Eyebrow>COMPRENDRE, POUR MIEUX PRENDRE SOIN</Eyebrow><h2>Une dent,<br />plusieurs <em>couches.</em></h2><p>Explorez les principales parties d’une dent grâce à cette représentation pédagogique en trois dimensions.</p><div className="tooth-note"><span className="note-line" /> Illustration éducative. Elle ne remplace pas l’évaluation d’un praticien.</div></div>
          <Suspense fallback={<div style={{ minHeight: 435, display: 'grid', placeItems: 'center', color: '#76847e', fontSize: 12 }}>Préparation du modèle 3D…</div>}><ToothExplorer /></Suspense>
        </div>
        <div className="tooth-corner">ANATOMIE DENTAIRE <span>·</span> MODÈLE INTERACTIF</div>
      </section>

      <section className="section practice-preview">
        <div className="preview-image-wrap"><img src={teamPhoto} alt="Un praticien et une assistante accueillent une patiente au cabinet" loading="lazy" /><span className="image-caption">Une mise en situation illustrative</span></div>
        <div className="preview-copy"><Eyebrow>UNE ÉQUIPE À VOTRE ÉCOUTE</Eyebrow><h2>La confiance<br />se construit <em>ensemble.</em></h2><p>Le cabinet est dirigé par son promoteur, chirurgien-dentiste, accompagné d’une équipe d’appui dédiée au fonctionnement et à l’activité du cabinet.</p><Link className="button button-outline" to="/equipe">Rencontrer l’équipe <ArrowUpRight size={17} /></Link><div className="preview-since"><span>Depuis</span><strong>2021</strong><span>à Banankabougou</span></div></div>
      </section>

      <CommunityBanner />
    </>
  );
}

function CommunityBanner() {
  return (
    <section className="community-section"><div className="community-inner"><div className="community-icon"><Heart size={22} /></div><div className="community-copy"><Eyebrow light>UN ENGAGEMENT LOCAL</Eyebrow><h2>Prendre soin, aussi<br /><em>à l’échelle du quartier.</em></h2><p>À partir de janvier 2027, un partenariat finalisé avec une école locale prévoit l’accompagnement des soins dentaires d’au moins <strong>780 élèves.</strong></p></div><div className="community-aside"><span className="community-date">JANVIER <strong>2027</strong></span><span className="community-students"><strong>780+</strong><small>élèves concernés</small></span><Link to="/cabinet" className="light-link">En savoir plus <ArrowUpRight size={16} /></Link></div></div><div className="community-pattern" aria-hidden="true" /></section>
  );
}

export function ServicesPage() {
  return (
    <>
      <PageIntro eyebrow="LES SOINS PROPOSÉS" title={<>Des soins<br />à chaque <em>besoin.</em></>} copy="Les soins sont organisés selon votre situation et l’évaluation du praticien. Les options vous sont expliquées avant d’établir le plan adapté." icon={<Stethoscope size={42} strokeWidth={1.15} />} />
      <section className="section service-page-body"><div className="section-heading"><div><Eyebrow>PRENDRE LE TEMPS DE L’ÉVALUATION</Eyebrow><h2>Un accompagnement<br /><em>adapté à votre situation.</em></h2></div><p>Les indications de soin sont définies avec le praticien. Le cabinet propose plusieurs types de prise en charge.</p></div>
        <div className="service-detail-grid">{services.map((service, index) => <Reveal key={service.number} className={index % 2 ? 'reveal-late' : ''}><article className={`service-detail-card${service.image ? ' service-detail-card--with-image' : ''}`}>{service.image && <img className="service-detail-image" src={service.image} alt={service.imageAlt} loading="lazy" />}<div className="detail-top"><span>{service.number}</span><span className="service-icon">{service.icon}</span></div><h3>{service.title}</h3><p>{service.desc}</p><span className="detail-rule" /></article></Reveal>)}</div>
        <div className="care-note"><span className="care-note-icon"><ShieldCheck size={19} /></span><p><strong>Une indication au cas par cas.</strong><br />Les extractions et le blanchiment sont proposés uniquement selon l’indication clinique. Les prothèses, l’orthodontie et les implants sont envisagés après évaluation du praticien et selon un plan adapté.</p></div>
      </section>
      <section className="dark-cta"><div><Eyebrow light>VOTRE PARCOURS COMMENCE PAR L’ÉCHANGE</Eyebrow><h2>Parlons de votre<br /><em>motif de visite.</em></h2></div><Link className="button button-light" to="/cabinet">Se renseigner au cabinet <ArrowUpRight size={17} /></Link></section>
    </>
  );
}

const teamRoles = [
  { n: '01', title: 'Le praticien responsable', text: 'Le promoteur du cabinet, chirurgien-dentiste, assure la responsabilité clinique et la prise en charge dentaire.', label: 'RESPONSABILITÉ CLINIQUE' },
  { n: '02', title: 'La secrétaire', text: 'Elle contribue à l’accueil et à l’organisation de la prise en charge au cabinet.', label: 'ACCUEIL' },
  { n: '03', title: 'L’assistante dentaire', text: 'Elle participe au fonctionnement quotidien de l’activité dentaire.', label: 'APPUI AUX SOINS' },
  { n: '04', title: 'Le dentiste prestataire', text: 'Il contribue à l’activité du cabinet en tant que praticien prestataire.', label: 'ÉQUIPE SOIGNANTE' },
];
const careSteps = [
  { n: '01', title: 'Accueil', text: 'Échanger sur le motif de consultation et organiser la prise en charge.' },
  { n: '02', title: 'Évaluation', text: 'Le praticien évalue la situation bucco-dentaire et vos besoins.' },
  { n: '03', title: 'Soins', text: 'Les options de soins sont expliquées selon l’indication clinique.' },
  { n: '04', title: 'Suivi', text: 'La suite de la prise en charge s’organise selon le plan retenu.' },
];

export function TeamPage() {
  return (
    <>
      <PageIntro eyebrow="LES PERSONNES QUI VOUS ACCUEILLENT" title={<>Une équipe<br /><em>au service du soin.</em></>} copy="Une organisation de proximité centrée sur l’écoute et l’accompagnement de chaque patient." icon={<Users size={42} strokeWidth={1.15} />} />
      <section className="section team-page-body"><div className="section-heading"><div><Eyebrow>UNE ÉQUIPE ORGANISÉE AUTOUR DU SOIN</Eyebrow><h2>Chacun contribue<br />à la <em>prise en charge.</em></h2></div><p>Le cabinet est dirigé par son promoteur, chirurgien-dentiste. Une équipe d’appui participe à l’accueil et au fonctionnement quotidien.</p></div>
        <div className="team-roles-grid">{teamRoles.map((role) => <Reveal key={role.n}><article className="team-role"><div className="team-role-head"><span className="team-role-num">{role.n}</span><span className="role-label">{role.label}</span></div><h3>{role.title}</h3><p>{role.text}</p><span className="role-line" /></article></Reveal>)}</div>
      </section>
      <section className="team-image-band"><img src={teamPhoto} alt="Illustration d’un échange entre une équipe dentaire et une patiente" loading="lazy" /><div className="team-image-copy"><Eyebrow light>UN ACCUEIL DE PROXIMITÉ</Eyebrow><h2>À l’écoute,<br />à chaque <em>étape.</em></h2><p>Les images présentées sont illustratives et ne prétendent pas représenter les membres réels du cabinet.</p></div></section>
      <section className="section care-journey"><div className="section-heading"><div><Eyebrow>VOTRE PARCOURS DE SOINS</Eyebrow><h2>Un parcours<br /><em>en quatre étapes.</em></h2></div><p>De votre arrivée au suivi, le praticien évalue la situation et vous explique les options de soin.</p></div><div className="journey-grid">{careSteps.map((step) => <Reveal key={step.n}><article className="journey-step"><span className="journey-num">{step.n}</span><h3>{step.title}</h3><p>{step.text}</p><span className="journey-dot" /></article></Reveal>)}</div></section>
      <div className="center-link team-contact-link"><Link className="text-link" to="/cabinet">En savoir plus sur le cabinet <ArrowRight size={17} /></Link></div>
    </>
  );
}

export function CabinetPage() {
  return (
    <>
      <PageIntro eyebrow="NOUS TROUVER" title={<>Au cœur de<br /><em>Banankabougou.</em></>} copy="Le Cabinet Dentaire Sissoko est implanté dans le secteur de Faladié, en Commune VI du District de Bamako." icon={<MapPin size={42} strokeWidth={1.15} />} />
      <section className="section cabinet-location"><div className="location-visual"><div className="location-art" aria-label="Repère général de Banankabougou, sans indication d’adresse précise"><div className="map-grid" /><div className="map-ring ring-a" /><div className="map-ring ring-b" /><div className="map-marker"><span /><span className="marker-pulse" /></div><span className="map-label label-bamako">BAMAKO</span><span className="map-label label-commune">COMMUNE VI</span><span className="map-label label-bank">BANANKABOUGOU</span><span className="map-north">N <ArrowUpRight size={13} /></span></div><p className="visual-caption"><MapPin size={13} /> Localisation générale · aucun repère d’adresse précis</p></div>
        <div className="location-copy"><Eyebrow>IMPLANTATION DE PROXIMITÉ</Eyebrow><h2>Dans votre<br /><em>quartier.</em></h2><p>Le cabinet se trouve à l’avant d’un immeuble à usage mixte. Deux pièces sont dédiées à l’activité dentaire et l’espace est équipé d’un fauteuil patient.</p><div className="address-card"><span className="address-pin"><MapPin size={18} /></span><div><strong>Banankabougou — secteur de Faladié</strong><span>Commune VI, District de Bamako, Mali</span></div></div><div className="address-caution">Cette indication situe le quartier ; aucune adresse postale plus précise n’est fournie.</div></div></section>
      <section className="section rooms-section"><div className="section-heading"><div><Eyebrow>UN ESPACE DÉDIÉ AUX SOINS DENTAIRES</Eyebrow><h2>Un cadre simple,<br /><em>pensé pour soigner.</em></h2></div><p>L’espace professionnel accueille les consultations et les soins du cabinet.</p></div><div className="room-facts"><article><span className="fact-number">02</span><strong>Pièces dédiées</strong><span>à l’activité dentaire</span></article><span className="fact-divider"/><article><span className="fact-number fact-icon"><Stethoscope size={26} /></span><strong>Un fauteuil patient</strong><span>au sein de l’espace de soins</span></article><span className="fact-divider"/><article><span className="fact-number fact-words">Depuis</span><strong>2021</strong><span>au service du quartier</span></article></div></section>
      <CommunityBanner />
      <section className="visit-callout"><div className="visit-icon"><CalendarDays size={23} /></div><div><Eyebrow>RENDEZ-VOUS</Eyebrow><h2>Un rendez-vous en tête ?</h2><p>Pour les rendez-vous, adressez-vous directement au cabinet.</p></div><Link className="button button-primary" to="/soins">Consulter les soins proposés <ArrowRight size={17} /></Link></section>
    </>
  );
}

export function NotFoundPage() {
  return <section className="not-found"><Eyebrow>PAGE INTROUVABLE</Eyebrow><h1>Cette page n’est pas disponible.</h1><p>Retrouvez les informations du Cabinet Dentaire Sissoko depuis l’accueil.</p><Link className="button button-primary" to="/">Revenir à l’accueil <ArrowRight size={17} /></Link></section>;
}

export { SiteLayout };
