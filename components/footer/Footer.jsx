"use client";

import React from "react";

import {Divider, Link} from "@heroui/react";

import {Icon} from "@iconify/react";

import Image from "next/image";

import darkLogo from "@/images/dark-logo.png";

const footerNavigation = {
  services: [
    {name: "Hakkımızda", href: "/hakkimizda"},
    {name: "İletişim", href: "/iletisim"},
    {name: "Mağazalarımız", href: "/magazalarimiz"},
    {name: "Kariyer", href: "/kariyer"},
  ],
  supportOptions: [
    {name: "Sipariş Takibi", href: "/siparis-takibi"},
    {name: "Teslimat Bilgileri", href: "/teslimat-bilgileri"},
    {name: "İade & Değişim", href: "/iade-degisim"},
    {name: "Sıkça Sorulan Sorular", href: "/sss"},
  ],
  aboutUs: [
    {name: "Çiçek Türleri", href: "/cicek-turleri"},
    {name: "Özel Günler", href: "/ozel-gunler"},
    {name: "Bitkiler", href: "/bitkiler"},
    {name: "Premium Çiçekler", href: "/premium-cicekler"},
    {name: "Saksılar", href: "/saksilar"},
  ],
  legal: [
    {name: "Gizlilik Politikası", href: "/gizlilik-politikasi"},
    {name: "Kullanım Koşulları", href: "/kullanim-kosullari"},
    {name: "KVKK", href: "/kvkk"},
    {name: "Mesafeli Satış Sözleşmesi", href: "/mesafeli-satis"},
  ],
  social: [
    {
      name: "Facebook",
      href: "#",
      icon: (props) => <Icon {...props} icon="fontisto:facebook" />,
    },
    {
      name: "Instagram",
      href: "#",
      icon: (props) => <Icon {...props} icon="fontisto:instagram" />,
    },
    {
      name: "Twitter",
      href: "#",
      icon: (props) => <Icon {...props} icon="fontisto:twitter" />,
    },
  ],
};

export default function Component() {
  const renderList = React.useCallback(
    ({title, items}) => (
      <div>
        <h3 className="text-small text-default-600 font-semibold">{title}</h3>
        <ul className="mt-6 space-y-4">
          {items.map((item) => (
            <li key={item.name}>
              <Link className="text-default-400" href={item.href} size="sm">
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    ),
    [],
  );

  return (
    <footer className="flex w-full flex-col">
      <div className="max-w-[1650px] w-full mx-auto px-6 pt-16 pb-8 sm:pt-24 lg:px-8 lg:pt-32">
        <div className="xl:grid xl:grid-cols-5 xl:gap-8">
          <div className="space-y-8 md:pr-8">
            <div className="flex items-center justify-start">
              <Image
                src={darkLogo}
                alt="Çiçekpaketi"
                width={160}
                height={50}
                className="h-auto"
              />
            </div>
            <p className="text-small text-default-500">
              Türkiye'nin en güvenilir canlı çiçek ve bitki satış platformu. Sevdiklerinize özel anlar yaşatın.
            </p>
            <div className="flex space-x-6">
              {footerNavigation.social.map((item) => (
                <Link key={item.name} isExternal className="text-default-400" href={item.href}>
                  <span className="sr-only">{item.name}</span>
                  <item.icon aria-hidden="true" className="w-6" />
                </Link>
              ))}
            </div>
          </div>
          <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-4 xl:mt-0 md:grid-cols-4">
            <div>{renderList({title: "Kurumsal", items: footerNavigation.services})}</div>
            <div>{renderList({title: "Müşteri Hizmetleri", items: footerNavigation.supportOptions})}</div>
            <div>{renderList({title: "Kategoriler", items: footerNavigation.aboutUs})}</div>
            <div>{renderList({title: "Yasal", items: footerNavigation.legal})}</div>
          </div>
        </div>
        <Divider className="mt-12 sm:mt-16" />
        <div className="flex flex-wrap justify-between items-center gap-4 pt-6">
          <p className="text-small text-default-400">&copy; 2024 Çiçekpaketi. Tüm hakları saklıdır.</p>
          <div className="flex gap-2 flex-wrap">
            {/* VISA */}
            <div className="w-14 h-9 bg-white border border-default-200 rounded flex items-center justify-center shadow-sm">
              <svg viewBox="0 0 48 32" className="w-10 h-6">
                <path fill="#1434CB" d="M20.1 8.3l-3.6 15.4h-3.6L16.5 8.3h3.6zm16.7 9.9l1.9-5.2.9 5.2h-2.8zm4 5.5h3.3l-2.9-15.4h-3c-.7 0-1.3.4-1.5 1l-5.3 14.4h3.8l.8-2.1h4.6l.2 2.1zm-9.5-5c0-4-5.6-4.3-5.5-6.1 0-.5.5-1.1 1.7-1.2.6-.1 2.2-.1 4 .7l.7-3.3c-1-.4-2.3-.7-3.8-.7-4 0-6.9 2.1-6.9 5.2 0 2.3 2 3.5 3.6 4.3 1.6.8 2.2 1.3 2.2 2 0 1.1-1.3 1.6-2.5 1.6-2.1 0-3.2-.3-4.9-1l-.7 3.3c1.1.5 3.2.9 5.3.9 4.3.1 7.1-2 7.1-5.2l-.3-.5zM18.1 8.3L11.2 23.7H7.3L3.9 11c-.2-.8-.4-1.1-1-1.4C2 9.1.5 8.7 0 8.5l.1-.3h6.2c.8 0 1.5.5 1.7 1.4l1.6 8.4 3.9-9.8h3.6z"/>
              </svg>
            </div>
            {/* MasterCard */}
            <div className="w-14 h-9 bg-white border border-default-200 rounded flex items-center justify-center shadow-sm">
              <svg viewBox="0 0 48 32" className="w-10 h-6">
                <circle cx="15" cy="16" r="10" fill="#EB001B"/>
                <circle cx="33" cy="16" r="10" fill="#F79E1B"/>
                <path d="M24 8.8c-2.3 1.8-3.8 4.6-3.8 7.7s1.5 5.9 3.8 7.7c2.3-1.8 3.8-4.6 3.8-7.7s-1.5-5.9-3.8-7.7z" fill="#FF5F00"/>
              </svg>
            </div>
            {/* AMEX */}
            <div className="w-14 h-9 bg-white border border-default-200 rounded flex items-center justify-center shadow-sm">
              <span className="text-[10px] font-bold text-blue-700">AMEX</span>
            </div>
            {/* TROY */}
            <div className="w-14 h-9 bg-white border border-default-200 rounded flex items-center justify-center shadow-sm">
              <span className="text-[10px] font-bold text-orange-600">TROY</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
