import { redirect } from 'next/navigation';

export default function RootPage() {
  // 首页作为系统前置路由器，直接跳转至访问控制台
  redirect("/login");
}
