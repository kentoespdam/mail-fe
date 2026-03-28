import Image from "next/image";
import { Providers } from "@/app/providers";
import TopBarMenu from "./top-menu";

const TopBar = () => {
	return (
		<header className="sticky top-0 flex justify-between shrink-0 gap-2 border-b bg-background px-4 pt-1">
			<div>
				<Image
					loading="eager"
					src="/eoffice.jpg"
					alt="logo"
					width={250}
					height={52}
					style={{ width: "auto", height: "auto" }}
				/>
			</div>
			<div className="grid justify-items-end">
				<Providers>
					<TopBarMenu />
				</Providers>
				<div>
					<b>Bagus Sudrajat, S.Kom.</b>, as Administrator
				</div>
			</div>
		</header>
	);
};

export default TopBar;
