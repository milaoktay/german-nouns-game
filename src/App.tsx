import './App.scss';
import { useState, useEffect } from 'react';
import axios from 'axios';

const url = 'https://edwardtanguay.vercel.app/share/germanNouns.json';

interface INoun {
	article: string;
	singular: string;
	plural: string;
	isOpen: boolean;
	isLearned: boolean;
}

function App() {
	const [nouns, setNouns] = useState<INoun[]>([]);
	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			try {
				const response = await axios.get(url);
				setNouns(response.data.sort(() => Math.random() - 0.5));
			} catch (error: any) {
				console.error(error.message);
			}
			setLoading(false);
		};

		fetchData();
		const _nouns: INoun[] = [];
		nouns.forEach((rawNoun: any) => {
			const _noun: INoun = {
				...rawNoun,
				isOpen: false,
				isLearned: false,
			};
			_nouns.push(_noun);
		});

		setNouns(_nouns);
	}, []);

	const handleFlashcardClick = (noun: INoun) => {
		noun.isOpen = !noun.isOpen;
		setNouns([...nouns]);
	};

	const handleMarkAsLearned = (noun: INoun) => {
		noun.isLearned = !noun.isLearned;
		noun.isOpen = false;
		setNouns([...nouns]);
	};

	return (
		<div className="App">
			<h1>German Noun Game</h1>
			<h2>
				You have learned{' '}
				{nouns.reduce(
					(total, noun) => total + (noun.isLearned ? 1 : 0),
					0
				)}{' '}
				of {nouns.length} nouns:
			</h2>
			<div className="nouns">
				{nouns.map((noun, i) => {
					return (
						<div className="noun" key={i}>
							<div
								className="front"
								onClick={() => handleFlashcardClick(noun)}
							>
								{noun.singular}
							</div>
							{noun.isOpen && (
								<div className="back">
									<div className="singular">
										{noun.article} {noun.singular}
									</div>
									<div className="plural">{noun.plural}</div>
									<button
										onClick={() =>
											handleMarkAsLearned(noun)
										}
									>
										Mark as learned
									</button>
								</div>
							)}
						</div>
					);
				})}
			</div>
		</div>
	);
}

export default App;
