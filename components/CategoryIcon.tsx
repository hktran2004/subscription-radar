import { BagIcon, CartIcon, FuelIcon, RecurringIcon, TicketIcon, UtensilsIcon } from "@/components/icons";

const CATEGORY_ICONS: Record<string, (props: { className?: string }) => JSX.Element> = {
  Subscription: RecurringIcon,
  Groceries: CartIcon,
  Transport: FuelIcon,
  Dining: UtensilsIcon,
  Shopping: BagIcon,
  Entertainment: TicketIcon,
};

export function CategoryIcon({ category, className }: { category: string; className?: string }) {
  const Icon = CATEGORY_ICONS[category] ?? BagIcon;
  return <Icon className={className} />;
}
