"use client";

import { useState } from "react";
import { decryptJWT } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export default function Home() {
  const [decrypted, setDecrypted] = useState<string>(
    "Your decrypted token will be shown here",
  );
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsLoading(true);
    const formData = new FormData(event.currentTarget);
    const token = formData.get("token") as string;
    const key = formData.get("key") as string;

    if (!token || !key) {
      setError("Please provide both token and key");
      setIsLoading(false);
      return;
    }

    try {
      const decryptedData = await decryptJWT(key, token);
      if (decryptedData) {
        setDecrypted(JSON.stringify(decryptedData, null, 2));
      } else {
        setError("Failed to decrypt the token");
      }
    } catch (err) {
      setError("An error occurred while decrypting");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">JWT Decryptor</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="token" className="block mb-1">
            Token:
          </label>
          <input
            id="token"
            name="token"
            type="text"
            placeholder="Enter your token here"
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="key" className="block mb-1">
            Key:
          </label>
          <input
            id="key"
            name="key"
            type="password"
            placeholder="Enter your key here"
            className="w-full p-2 border rounded"
          />
        </div>
        <button
          type="submit"
          className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
          disabled={isLoading}
        >
          {isLoading ? "Decrypting..." : "Decrypt"}
        </button>
      </form>
      {error && <p className="mt-4 text-red-500">{error}</p>}
      <div className="mt-4">
        <h2 className="text-xl font-semibold mb-2">Decrypted Token:</h2>
        {isLoading ? (
          <div className="flex justify-center items-center h-20">
            <Loader2 className="animate-spin h-8 w-8 text-blue-500" />
          </div>
        ) : (
          <pre className="bg-gray-100 p-4 rounded overflow-x-auto">
            {decrypted}
          </pre>
        )}
      </div>
    </div>
  );
}
