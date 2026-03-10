import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Shield, Ban } from "lucide-react";

const mockUsers = [
  { id: "1", name: "Super Admin", email: "admin@indiaipo.in", role: "super_admin", status: "active", joined: "2024-01-15" },
  { id: "2", name: "Editor User", email: "editor@indiaipo.in", role: "editor", status: "active", joined: "2025-06-10" },
  { id: "3", name: "Priya Sharma", email: "priya@gmail.com", role: "investor", status: "active", joined: "2026-01-20" },
  { id: "4", name: "Amit Patel", email: "amit@company.com", role: "guest", status: "active", joined: "2026-02-15" },
];

const roleColor: Record<string, string> = {
  super_admin: "bg-destructive/15 text-destructive border-destructive/30",
  admin: "bg-accent/15 text-accent border-accent/30",
  editor: "bg-info/15 text-info border-info/30",
  investor: "bg-success/15 text-success border-success/30",
  guest: "bg-muted text-muted-foreground",
};

const ManageUsers = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Manage Users</h1>
          <p className="text-sm text-muted-foreground">{mockUsers.length} registered users</p>
        </div>

        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border bg-muted/50">
                <th className="text-left py-3 px-4 font-semibold">Name</th>
                <th className="text-left py-3 px-4 font-semibold hidden md:table-cell">Email</th>
                <th className="text-left py-3 px-4 font-semibold">Role</th>
                <th className="text-left py-3 px-4 font-semibold hidden lg:table-cell">Joined</th>
                <th className="text-left py-3 px-4 font-semibold">Actions</th>
              </tr></thead>
              <tbody>
                {mockUsers.map((u) => (
                  <tr key={u.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-4 font-medium">{u.name}</td>
                    <td className="py-3 px-4 text-muted-foreground hidden md:table-cell">{u.email}</td>
                    <td className="py-3 px-4">
                      <Badge variant="outline" className={roleColor[u.role]}>{u.role.replace("_", " ")}</Badge>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground hidden lg:table-cell">{u.joined}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Select defaultValue={u.role} onValueChange={() => toast.success("Role updated!")}>
                          <SelectTrigger className="h-8 w-[120px] text-xs"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="super_admin">Super Admin</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="editor">Editor</SelectItem>
                            <SelectItem value="investor">Investor</SelectItem>
                            <SelectItem value="guest">Guest</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button variant="ghost" size="sm" className="text-destructive" onClick={() => toast.success("User blocked")}>
                          <Ban className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ManageUsers;
