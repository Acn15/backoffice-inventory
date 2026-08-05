"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/domains/auth/presentation/auth-provider";
import {
  Button,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarNav,
  SidebarNavLink,
  type SidebarNavItem,
  Stack,
  Text,
} from "@/shared/ui";

const dashboardIcon = (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden className="size-5">
    <path
      d="M4 13h7V4H4v9Zm9 7h7V11h-7v9ZM4 20h7v-5H4v5Zm9-18v5h7V2h-7Z"
      fill="currentColor"
    />
  </svg>
);

const usersIcon = (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden className="size-5">
    <path
      d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm-7 8a7 7 0 0 1 14 0v1H5v-1Z"
      fill="currentColor"
    />
  </svg>
);

const stockIcon = (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden className="size-5">
    <path
      d="M3 7.5 12 3l9 4.5-9 4.5L3 7.5Zm0 4.5 9 4.5 9-4.5M3 16.5 12 21l9-4.5"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const movementIcon = (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden className="size-5">
    <path
      d="M7 7h11l-3-3m3 3-3 3M17 17H6l3 3m-3-3 3-3"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const productsIcon = (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden className="size-5">
    <path
      d="M4 7h16v12H4V7Zm4-3h8v3H8V4Z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
  </svg>
);

const categoriesIcon = (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden className="size-5">
    <path
      d="M4 6h7v7H4V6Zm9 0h7v4h-7V6Zm0 7h7v5h-7v-5ZM4 16h7v2H4v-2Z"
      fill="currentColor"
    />
  </svg>
);

const unitsIcon = (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden className="size-5">
    <path
      d="M4 20V9l8-5 8 5v11H4Zm4-2h3v-4h2v4h3v-7.2L12 7.4 8 10.8V18Z"
      fill="currentColor"
    />
  </svg>
);

const suppliersIcon = (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden className="size-5">
    <path
      d="M4 7h16v2H4V7Zm0 4h10v2H4v-2Zm0 4h16v2H4v-2Zm14-8.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"
      fill="currentColor"
    />
  </svg>
);

export const appNavItems: SidebarNavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: dashboardIcon },
  { href: "/users", label: "Usuários", icon: usersIcon },
  { href: "/units", label: "Lojas", icon: unitsIcon },
  { href: "/suppliers", label: "Fornecedores", icon: suppliersIcon },
  { href: "/products", label: "Produtos", icon: productsIcon },
  { href: "/products/categories", label: "Categorias", icon: categoriesIcon },
  { href: "/stocks", label: "Estoques", icon: stockIcon },
  { href: "/stocks/movements", label: "Movimentações", icon: movementIcon },
];

type AppSidebarProps = {
  open: boolean;
  onClose: () => void;
};

export function AppSidebar({ open, onClose }: AppSidebarProps) {
  const router = useRouter();
  const { user, logout } = useAuth();

  async function handleLogout() {
    await logout();
    onClose();
    router.replace("/login");
    router.refresh();
  }

  return (
    <Sidebar open={open} onClose={onClose}>
      <SidebarHeader>
        <Stack gap="sm">
          <Text as="h1" variant="h3">
            Automotive Parts
          </Text>
          <Text variant="muted">Gestão de peças</Text>
        </Stack>
        <Button
          variant="ghost"
          size="sm"
          className="md:hidden"
          onClick={onClose}
          aria-label="Fechar menu"
        >
          ✕
        </Button>
      </SidebarHeader>

      <SidebarContent>
        <SidebarNav>
          {appNavItems.map((item) => (
            <SidebarNavLink
              key={item.href}
              item={item}
              items={appNavItems}
              onNavigate={onClose}
            />
          ))}
        </SidebarNav>
      </SidebarContent>

      <SidebarFooter>
        <Stack gap="md">
          {user ? (
            <Stack gap="sm">
              <Text className="truncate text-sm font-medium">
                {user.name ?? "Usuário"}
              </Text>
              <Text variant="muted" className="truncate">
                {user.email}
              </Text>
            </Stack>
          ) : null}
          <Button variant="outline" fullWidth onClick={() => void handleLogout()}>
            Sair
          </Button>
        </Stack>
      </SidebarFooter>
    </Sidebar>
  );
}
