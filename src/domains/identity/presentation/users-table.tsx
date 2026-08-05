import { formatDateTime } from "@/core/utils/format-date";
import type { User } from "@/domains/identity/domain/entities/user";
import {
  Badge,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Text,
} from "@/shared/ui";

type UsersTableProps = {
  users: User[];
};

export function UsersTable({ users }: UsersTableProps) {
  if (users.length === 0) {
    return (
      <Text variant="muted">Nenhum usuário cadastrado ainda.</Text>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>E-mail</TableHead>
          <TableHead>Telefone</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Criado em</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell className="font-medium">{user.name}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>{user.phone ?? "—"}</TableCell>
            <TableCell>
              <Badge variant={user.status === "ACTIVE" ? "success" : "default"}>
                {user.status === "ACTIVE" ? "Ativo" : "Inativo"}
              </Badge>
            </TableCell>
            <TableCell>{formatDateTime(user.createdAt)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
