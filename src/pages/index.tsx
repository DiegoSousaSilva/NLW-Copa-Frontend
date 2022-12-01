import { FormEvent, useState } from "react";
import Image from "next/image";
import appPreviewImage from "../assets/app-nlw-copa-preview.png";
import logoImg from "../assets/logo.svg";
import usersAvatarExamplesImg from "../assets/users-avatar-example.png";
import iconCheckImg from "../assets/icon-check.svg";
import { api } from "../lib/axios";

interface HomeProps {
  betCount: number;
  guessCount: number;
  usersCount: number;
}

export default function Home(props: HomeProps) {
  const [betTitle, setBetTitle] = useState("");

  async function createBet(event: FormEvent) {
    event.preventDefault();

    try {
      const response = await api.post("/bets", {
        title: betTitle,
      });

      const { code } = response.data;

      await navigator.clipboard.writeText(code);

      alert(
        "O bolão foi criado com sucesso, o código foi copiado para a área de transferência!"
      );
      setBetTitle("");
    } catch (err) {
      alert("Falha ao criar o bolão tente novamente");
    }
  }

  return (
    <div className="max-w-[1124px]  mx-auto grid grid-cols-2 gap-28 items-center py-10 ">
      <main>
        <Image src={logoImg} alt="NLW Copa Logo" />

        <h1 className="mt-14 text-white text-5xl font-bold leading-tight">
          Crie seu prório bolão da copa e compartilhe entre amigos!
        </h1>

        <div className="mt-10 flex items-center gap-2">
          <Image src={usersAvatarExamplesImg} alt="" />
          <strong className="text-gray-100 text-xl">
            <span className="text-ignite-500">+ {props.usersCount}</span>{" "}
            pessoas já estão usando
          </strong>
        </div>

        <form onSubmit={createBet} className="mt-10 flex">
          <input
            className="flex-1 px-6 py-4 rounded bg-gray-800 border-gray-600 text-sm text-gray-100"
            type="text"
            required
            placeholder="Qual o nome de seu bolão?"
            value={betTitle}
            onChange={(event) => setBetTitle(event.target.value)}
          />
          <button
            className="bg-yellow-500 px-6 py-4 rounded text-gray-900 font-bold text-sm uppercase hover:bg-yellow-700"
            type="submit"
          >
            Criar meu bolão
          </button>
        </form>

        <p className="text-gray-300 mt-4 text-sm leading-relaxed">
          Após criar seu bolão, você receberá um código único que poderá usar
          para convidar outras pessoas
        </p>

        <div className="mt-10 pt-10 border-t flex items-center justify-between text-gray-100 border-gray-600">
          <div className="flex items-center gap-6">
            <Image src={iconCheckImg} alt="" />
            <div className="flex flex-col">
              <span className="font-bold text-2xl">+ {props.betCount}</span>
              <span>Bolões criados</span>
            </div>
          </div>

          <div className="w-px h-14 bg-gray-600"></div>

          <div className="flex items-center gap-6">
            <Image src={iconCheckImg} alt="" />
            <div className="flex flex-col">
              <span className="font-bold text-2xl ">+ {props.guessCount}</span>
              <span>Palpites enviados</span>
            </div>
          </div>
        </div>
      </main>

      <Image
        src={appPreviewImage}
        alt="Dois celulares exebindo previa da aplicação"
        quality={80}
      />
    </div>
  );
}

export const getServerSideProps = async () => {
  const [betCountResponse, guessCountResponse, usersCountResponse] =
    await Promise.all([
      api.get("bets/count"),
      api.get("guesses/count"),
      api.get("users/count"),
    ]);

  return {
    props: {
      betCount: betCountResponse.data.count,
      guessCount: guessCountResponse.data.count,
      usersCount: usersCountResponse.data.count,
    },
  };
};
