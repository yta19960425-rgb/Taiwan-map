        :root {
            --primary-green: #6f9c76;
            --bg-gray: #f8f9fa;
            --text-dark: #333;
        }

        body {
            background-color: var(--bg-gray);
            margin: 0;
            font-family: "Microsoft JhengHei", sans-serif;
        }

        /* 標題與分類區 */
        .header-section {
            text-align: center;
            padding: 40px 20px;
            background: white;
        }
        .header-section h1 {
            letter-spacing: 5px;
            color: var(--text-dark);
            margin-bottom: 25px;
        }

        .filter-group {
            display: flex;
            justify-content: center;
            gap: 15px;
            margin-bottom: 20px;
        }

        .filter-btn {
            padding: 10px 25px;
            border: 2px solid var(--primary-green);
            background: transparent;
            color: var(--primary-green);
            border-radius: 50px;
            cursor: pointer;
            font-weight: bold;
            transition: all 0.3s;
        }

        .filter-btn.active {
            background: var(--primary-green);
            color: white;
        }

        /* 卡片容器 */
        .discovery-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: 25px;
            max-width: 1200px;
            margin: 0 auto 50px;
            padding: 20px;
        }

        /* 拍立得卡片樣式 */
        .polaroid-card {
            background: white;
            padding: 15px 15px 40px 15px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            transition: transform 0.3s ease;
            cursor: pointer;
            position: relative;
            overflow: hidden;
        }

        .polaroid-card:hover {
            transform: translateY(-10px) rotate(2deg);
        }

        .card-img {
            width: 100%;
            height: 200px;
            background-color: #eee;
            background-size: cover;
            background-position: center;
            margin-bottom: 15px;
        }

        .card-caption {
            text-align: center;
            font-weight: bold;
            font-size: 1.2rem;
            color: var(--text-dark);
        }

        /* 詳細資訊疊層 */
        .card-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(111, 156, 118, 0.95);
            color: white;
            padding: 20px;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            justify-content: center;
            opacity: 0;
            transition: opacity 0.3s ease;
            text-align: center;
        }

        .polaroid-card:hover .card-overlay {
            opacity: 1;
        }

        .overlay-title {
            font-size: 1.1rem;
            margin-bottom: 10px;
            border-bottom: 1px solid white;
            padding-bottom: 5px;
        }

        .overlay-text {
            font-size: 0.95rem;
            line-height: 1.6;
        }

        @media (max-width: 600px) {
            .discovery-grid {
                grid-template-columns: 1fr;
                padding: 15px;
            }
        }
